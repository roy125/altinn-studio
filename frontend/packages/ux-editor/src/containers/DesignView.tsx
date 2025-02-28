import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from './Container';
import { FormLayoutActions } from '../features/formDesigner/formLayout/formLayoutSlice';
import type { IFormLayoutOrder } from '../types/global';
import { DroppableDraggableContainer } from './DroppableDraggableContainer';

import type { EditorDndEvents, EditorDndItem } from './helpers/dnd-types';
import { ItemType } from './helpers/dnd-types';
import {
  insertArrayElementAtPos,
  removeArrayElement,
  swapArrayElements,
} from 'app-shared/pure/array-functions';
import { useParams } from 'react-router-dom';
import { useDatamodelQuery } from '../hooks/queries/useDatamodelQuery';
import { useFormLayoutsSelector } from '../hooks/useFormLayoutsSelector';
import { selectedLayoutSelector } from '../selectors/formLayoutSelectors';
import { useUpdateFormContainerMutation } from '../hooks/mutations/useUpdateFormContainerMutation';
import { useUpdateFormComponentOrderMutation } from '../hooks/mutations/useUpdateFormComponentOrderMutation';
import { useUpdateContainerIdMutation } from '../hooks/mutations/useUpdateContainerIdMutation';
import { useDeleteFormContainerMutation } from '../hooks/mutations/useDeleteFormContainerMutation';
import { useTextResourcesSelector } from '../hooks/useTextResourcesSelector';
import { textResourcesByLanguageSelector } from '../selectors/textResourceSelectors';
import { DEFAULT_LANGUAGE } from 'app-shared/constants';
import { ITextResource } from 'app-shared/types/global';

export interface DesignViewProps {
  activeList: any[];
  isDragging: boolean;
  layoutOrder: IFormLayoutOrder;
  order: IFormLayoutOrder;
}

export interface DesignViewState {
  layoutOrder: IFormLayoutOrder;
  isDragging: boolean;
}

export const DesignView = ({
  activeList,
  isDragging,
  layoutOrder,
  order,
}: DesignViewProps) => {
  const [beforeDrag, setBeforeDrag] = useState(null);

  const [state, setState] = useState<DesignViewState>({ layoutOrder, isDragging });
  useEffect(
    () => setState({ layoutOrder, isDragging }),
    [layoutOrder, isDragging]
  );

  const { org, app } = useParams();
  const { data: datamodel } = useDatamodelQuery(org, app);
  const textResources: ITextResource[] = useTextResourcesSelector<ITextResource[]>(textResourcesByLanguageSelector(DEFAULT_LANGUAGE));
  const { components, containers } = useFormLayoutsSelector(selectedLayoutSelector);
  const updateFormContainerMutation = useUpdateFormContainerMutation(org, app);
  const updateFormComponentOrderMutation = useUpdateFormComponentOrderMutation(org, app);
  const updateContainerIdMutation = useUpdateContainerIdMutation(org, app);
  const deleteFormContainerMutation = useDeleteFormContainerMutation(org, app);

  const setContainerLayoutOrder = (containerId: string, newLayoutOrder: string[]) => {
    if (newLayoutOrder.includes(containerId)) {
      throw Error("can't add item to itself");
    }
    setState({
      layoutOrder: { ...state.layoutOrder, [containerId]: newLayoutOrder },
      isDragging: true,
    });
  };

  const removeItemFromContainer = (item: EditorDndItem): void => {
    const updatedLayoutOrder = removeArrayElement(state.layoutOrder[item.containerId], item.id);
    setContainerLayoutOrder(item.containerId, updatedLayoutOrder);
    item.index = undefined;
    item.containerId = undefined;
  };

  const addItemToContainer = (
    item: EditorDndItem,
    targetContainerId: string,
    targetPos: number
  ) => {
    const newLayoutOrder = insertArrayElementAtPos(
      state.layoutOrder[targetContainerId],
      item.id,
      targetPos
    );
    setContainerLayoutOrder(targetContainerId, newLayoutOrder);
    item.index = newLayoutOrder.indexOf(item.id);
    item.containerId = targetContainerId;
  };

  const moveItemBetweenContainers = (
    item: EditorDndItem,
    targetContainerId: string,
    targetContainerPosition: number
  ) => {
    removeItemFromContainer(item);
    addItemToContainer(item, targetContainerId, targetContainerPosition);
  };

  const moveItemToTop = (item: EditorDndItem) => {
    const arr = state.layoutOrder[item.containerId];
    swapItemsInsideTheSameContainer(item, arr[0]);
  };

  const moveItemToBottom = (item: EditorDndItem) => {
    const arr = state.layoutOrder[item.containerId];
    swapItemsInsideTheSameContainer(item, arr[arr.length - 1]);
  };

  const swapItemsInsideTheSameContainer = (movedItem: EditorDndItem, targetId: string): void => {
    const currentLayoutOrder = state.layoutOrder[movedItem.containerId];
    const newLayoutOrder = swapArrayElements(currentLayoutOrder, movedItem.id, targetId);
    setContainerLayoutOrder(movedItem.containerId, newLayoutOrder);
    movedItem.index = newLayoutOrder.indexOf(movedItem.id);
  };

  const moveItem = (
    movedItem: EditorDndItem,
    targetItem: EditorDndItem,
    toIndex?: number
  ): void => {
    if (
      !movedItem.id ||
      (ItemType.Item && !movedItem.containerId) ||
      (targetItem.type === ItemType.Container && movedItem.containerId === targetItem.id) ||
      (movedItem.id === targetItem.id)
    ) return;

    if (!beforeDrag) {
      setBeforeDrag(state.layoutOrder);
    }

    if (movedItem.containerId === targetItem.containerId) {
      swapItemsInsideTheSameContainer(movedItem, targetItem.id);
    } else if (targetItem.type === ItemType.Container && toIndex !== undefined) {
      moveItemBetweenContainers(movedItem, targetItem.id, toIndex);
    } else if (targetItem.type === ItemType.Item && movedItem.id !== targetItem.containerId) {
      moveItemBetweenContainers(movedItem, targetItem.containerId, targetItem.index);
    } else {
      // There is nothing that should be moved.
    }
  };

  const resetState = () => {
    beforeDrag && setState({ layoutOrder: beforeDrag, isDragging: false });
  };
  const dispatch = useDispatch();
  const onDropItem = (reset?: boolean) => {
    if (reset) {
      resetState();
    } else {
      updateFormComponentOrderMutation.mutate(state.layoutOrder);
      setState({ ...state, isDragging: false });
      dispatch(
        FormLayoutActions.updateActiveListOrder({
          containerList: activeList,
          orderList: order as any,
        })
      );
    }
    setBeforeDrag(null);
  };
  const baseContainerId =
    Object.keys(state.layoutOrder).length > 0 ? Object.keys(state.layoutOrder)[0] : null;

  const dndEvents: EditorDndEvents = {
    moveItem,
    moveItemToBottom,
    moveItemToTop,
    onDropItem,
  };
  return (
    baseContainerId && (
      <DroppableDraggableContainer
        id={baseContainerId}
        isBaseContainer={true}
        canDrag={false}
        dndEvents={dndEvents}
        container={() => (
          <Container
            isBaseContainer={true}
            id={baseContainerId}
            items={state.layoutOrder[baseContainerId]}
            layoutOrder={state.layoutOrder}
            dndEvents={dndEvents}
            dataModel={datamodel}
            components={components}
            containers={containers}
            itemOrder={order}
            updateFormContainerMutation={updateFormContainerMutation}
            updateContainerIdMutation={updateContainerIdMutation}
            deleteFormContainerMutation={deleteFormContainerMutation}
            textResources={textResources}
          />
        )}
      />
    )
  );
};
