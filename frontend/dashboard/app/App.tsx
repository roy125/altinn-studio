import React from 'react';
import classes from './App.module.css';
import { PageSpinner } from 'app-shared/components';
import { CreateService } from '../pages/CreateService';
import { Dashboard } from '../pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserQuery } from '../hooks/useUserQueries';
import { useOrganizationsQuery } from 'dashboard/hooks/useOrganizationQueries';
import { ErrorMessage } from 'dashboard/components/ErrorMessage';

import './App.css';
import { PageLayout } from 'dashboard/pages/PageLayout';

export const App = (): JSX.Element => {
  const { t } = useTranslation();
  const { data: user, isError: isUserError } = useUserQuery();
  const { data: organizations, isError: isOrganizationsError } = useOrganizationsQuery();

  const componentIsReady = user && organizations;
  const componentHasError = isUserError || isOrganizationsError;

  const getErrorMessage = (): { title: string; message: string } => {
    const defaultTitle = 'Feil oppstod ved innlasting av';
    const defaultMessage = 'Vi beklager men en feil oppstod ved henting av';
    if (isUserError) {
      return {
        title: `${defaultTitle} brukerdata`,
        message: `${defaultMessage} dine brukerdata.`,
      };
    }
    if (isOrganizationsError) {
      return {
        title: `${defaultTitle} organisasjoner`,
        message: `${defaultMessage} organisasjoner som kreves for å kjøre applikasjonen.`,
      };
    }
    return {
      title: 'Ukjent feil oppstod',
      message: 'Vi beklager men en ukjent feil, vennligst prøv igjen senere.',
    };
  };

  if (componentHasError) {
    const error = getErrorMessage();
    return <ErrorMessage title={error.title} message={error.message} />;
  }

  if (componentIsReady) {
    return (
      <div className={classes.root}>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path='/:selectedContext?' element={<Dashboard user={user} organizations={organizations} />} />
            <Route
              path='/:selectedContext/new'
              element={<CreateService organizations={organizations} user={user} />}
            />
          </Route>
        </Routes>
      </div>
    );
  }

  return <PageSpinner text={t('dashboard.loading')} />;
};
