import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch } from 'react-redux';
import { RightMenu } from '../components/rightMenu/RightMenu';
import { DesignView } from './DesignView';
import type { IFormLayoutOrder } from '../types/global';
import { deepCopy } from 'app-shared/pure';
import classes from './FormDesigner.module.css';
import { LeftMenu } from '../components/leftMenu/LeftMenu';
import { useText } from '../hooks';
import { useParams } from 'react-router-dom';
import { useFormLayoutsSelector } from '../hooks/useFormLayoutsSelector';
import { selectedLayoutSelector } from '../selectors/formLayoutSelectors';
import { useAddLayoutMutation } from '../hooks/mutations/useAddLayoutMutation';

type FormDesignerProps = {
  selectedLayout: string;
  activeList: any;
  layoutOrder: IFormLayoutOrder;
};
export const FormDesigner = ({
  activeList,
  layoutOrder,
  selectedLayout,
}: FormDesignerProps): JSX.Element => {
  const dispatch = useDispatch();
  const { org, app } = useParams();
  const { order } = useFormLayoutsSelector(selectedLayoutSelector);
  const addLayoutMutation = useAddLayoutMutation(org, app);
  const layoutOrderCopy = deepCopy(layoutOrder || {});
  const t = useText();

  useEffect((): void => {
    const addInitialPage = (): void => {
      const layoutName = `${t('general.page')}1`;
      addLayoutMutation.mutate({ layoutName, isReceiptPage: false });
    };

    const layoutsExist = layoutOrder && !Object.keys(layoutOrder).length;
    // Old apps might have selectedLayout='default' even when there exist a single layout.
    // Should only add initial page if no layouts exist.
    if (selectedLayout === 'default' && !layoutsExist) {
      addInitialPage();
    }
  }, [app, dispatch, org, selectedLayout, t, layoutOrder, addLayoutMutation]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classes.root}>
        <div className={classes.container} id='formFillerGrid'>
          <div className={classes.leftContent + ' ' + classes.item}>
            <LeftMenu />
          </div>
          <div className={classes.mainContent + ' ' + classes.item}>
            <h1 className={classes.pageHeader}>{selectedLayout}</h1>
            <DesignView
              order={order}
              activeList={activeList}
              isDragging={false}
              layoutOrder={layoutOrderCopy}
            />
          </div>
          <div className={classes.rightContent + ' ' + classes.item}>
            <RightMenu />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
