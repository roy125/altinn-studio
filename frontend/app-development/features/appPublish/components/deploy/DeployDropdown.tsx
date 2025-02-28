import React, { useState } from 'react';
import classes from './DeployDropdown.module.css';
import { AltinnIcon, AltinnSpinner } from 'app-shared/components';
import {
  Button,
  ButtonVariant,
  Popover,
  PopoverVariant,
  Select,
} from '@digdir/design-system-react';
import { ButtonContainer } from 'app-shared/primitives';
import { DeploymentStatus, ImageOption } from '../appDeploymentComponent';
import { formatTimeHHmm } from 'app-shared/pure/date-format';
import { getAzureDevopsBuildResultUrl } from '../../../../utils/urlHelper';
import { shouldDisplayDeployStatus } from './utils';
import { useTranslation, Trans } from 'react-i18next';

interface DeployDropdownProps {
  appDeployedVersion: string;
  envName: string;
  imageOptions: ImageOption[];
  disabled: boolean;
  deployHistoryEntry: any;
  deploymentStatus: DeploymentStatus | string | number;
  setSelectedImageTag: (tag) => void;
  selectedImageTag: string;
  startDeploy: any;
}

export const DeployDropdown = ({
  appDeployedVersion,
  imageOptions,
  envName,
  deploymentStatus,
  deployHistoryEntry,
  selectedImageTag,
  setSelectedImageTag,
  disabled,
  startDeploy,
}: DeployDropdownProps) => {
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const { t } = useTranslation();
  const onStartDeployClick = async () => {
    await startDeploy();
    setPopoverIsOpen(false);
  };
  return (
    <>
      <div>{t('app_deploy_messages.choose_version')}</div>
      <div className={classes.select} id={`deploy-select-${envName.toLowerCase()}`}>
        {imageOptions.length > 0 && (
          <Select
            key={imageOptions.length}
            options={imageOptions || []}
            onChange={(value: string) => setSelectedImageTag(value)}
          />
        )}
      </div>
      <div className={classes.deployButton}>
        <Popover
          open={popoverIsOpen}
          placement={'right'}
          variant={PopoverVariant.Warning}
          trigger={
            <Button
              disabled={disabled}
              onClick={(_) => setPopoverIsOpen(!popoverIsOpen)}
              id={`deploy-button-${envName.toLowerCase()}`}
            >
              {t('app_deploy_messages.btn_deploy_new_version')}
            </Button>
          }
        >
          <>
            {appDeployedVersion
              ? t('app_deploy_messages.deploy_confirmation', {
                  selectedImageTag,
                  appDeployedVersion,
                })
              : t('app_deploy_messages.deploy_confirmation_short', { selectedImageTag })}
            <ButtonContainer>
              <Button
                id={`deploy-button-${envName.toLowerCase()}-confirm`}
                onClick={onStartDeployClick}
              >
                Ja
              </Button>
              <Button onClick={(_) => setPopoverIsOpen(false)} variant={ButtonVariant.Quiet}>
                Avbryt
              </Button>
            </ButtonContainer>
          </>
        </Popover>
      </div>
      {shouldDisplayDeployStatus(deployHistoryEntry?.created) && (
        <div className={classes.deployStatusGridContainer}>
          <div className={classes.deploySpinnerGridItem}>
            {deploymentStatus === DeploymentStatus.inProgress && <AltinnSpinner />}
            {deploymentStatus === DeploymentStatus.succeeded && (
              <AltinnIcon iconClass='ai ai-check-circle' iconColor='#12AA64' iconSize='3.6rem' />
            )}
            {(deploymentStatus === DeploymentStatus.partiallySucceeded ||
              deploymentStatus === DeploymentStatus.none) && (
              <AltinnIcon iconClass='ai ai-info-circle' iconColor='#008FD6' iconSize='3.6rem' />
            )}
            {(deploymentStatus === DeploymentStatus.canceled ||
              deploymentStatus === DeploymentStatus.failed) && (
              <AltinnIcon
                iconClass='ai ai-circle-exclamation'
                iconColor='#E23B53'
                iconSize='3.6rem'
              />
            )}
          </div>
          <div>
            {deploymentStatus === DeploymentStatus.inProgress &&
              t('app_deploy_messages.deploy_in_progress', {
                createdBy: deployHistoryEntry?.createdBy,
                tagName: deployHistoryEntry?.tagName,
              })}
            {deploymentStatus === DeploymentStatus.succeeded &&
              t('app_deploy_messages.success', {
                tagName: deployHistoryEntry?.tagName,
                time: formatTimeHHmm(deployHistoryEntry?.build.finished),
                envName,
                createdBy: deployHistoryEntry?.createdBy,
              })}
            {deploymentStatus === DeploymentStatus.failed &&
              t('app_deploy_messages.failed', {
                tagName: deployHistoryEntry?.tagName,
                time: formatTimeHHmm(deployHistoryEntry?.build.finished),
                envName,
              })}
            {deploymentStatus === DeploymentStatus.canceled &&
              t('app_deploy_messages.canceled', {
                tagName: deployHistoryEntry?.tagName,
                time: formatTimeHHmm(deployHistoryEntry?.build.finished),
                envName,
              })}
            {deploymentStatus === DeploymentStatus.partiallySucceeded &&
              t('app_deploy_messages.partiallySucceeded', {
                tagName: deployHistoryEntry?.tagName,
                envName,
                time: formatTimeHHmm(deployHistoryEntry?.build.finished),
              })}
            {deploymentStatus === DeploymentStatus.none &&
              t('app_deploy_messages.none', {
                tagName: deployHistoryEntry?.tagName,
                time: formatTimeHHmm(deployHistoryEntry?.build.finished),
                envName,
              })}{' '}
            <Trans i18nKey={'app_deploy_messages.see_build_log'}>
              <a
                href={getAzureDevopsBuildResultUrl(deployHistoryEntry?.build.id)}
                target='_newTab'
                rel='noopener noreferrer'
              />
            </Trans>
          </div>
        </div>
      )}
    </>
  );
};
