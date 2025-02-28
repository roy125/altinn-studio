import classes from './Variables.module.css';
import { PanelVariant, PopoverPanel } from '@altinn/altinn-design-system';
import { Button, ButtonSize, ButtonVariant } from '@digdir/design-system-react';
import { InformationSquareFillIcon } from '@navikt/aksel-icons';
import React, { useState } from 'react';
import type { TextResourceVariable } from './types';

export type VariablesProps = {
  variables: TextResourceVariable[];
};

export const Variables = ({ variables }: VariablesProps) => {
  const [infoboxOpen, setInfoboxOpen] = useState(false);
  return (
    <div title={'Det er ikke lagt til støtte for redigering av variabler i Studio.'}>
      {variables.map((variable) => (
        <div key={variable.key} className={classes.chip}>
          {`${variable.key}: ${variable.dataSource}`}
        </div>
      ))}
      {variables.length > 0 && (
        <span className={classes.infoButton}>
          <PopoverPanel
            title={'Kun for visning'}
            variant={PanelVariant.Info}
            trigger={
              <Button
                icon={<InformationSquareFillIcon />}
                variant={ButtonVariant.Quiet}
                size={ButtonSize.Small}
              />
            }
            open={infoboxOpen}
            onOpenChange={setInfoboxOpen}
          >
            <div>Det er ikke mulig å redigere variabler i Studio.</div>
          </PopoverPanel>
        </span>
      )}
    </div>
  );
};
