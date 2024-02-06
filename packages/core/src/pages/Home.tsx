import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { convertStringToPath } from '../utils';
import { IApp, IFeature } from '../types/common.types';
import appConfig from '../constants/app-config.json';

export interface IHome {
  app?: IApp;
}

function Home({ app }: IHome) {
  const renderApps = () => {
    return appConfig.apps.map((configApp) => {
      const path = `/${convertStringToPath(configApp.name)}`;
      return (
        <Button sx={{ background: 'rgb(41, 171, 48)' }} key={path} variant='contained' component={Link} to={path}>
          {configApp.name}
        </Button>
      );
    });
  };

  const renderFeatures = (app: IApp) => {
    const parentPath = `/${convertStringToPath(app.name)}`;

    return app.features.map((feature: IFeature) => {
      const childPath = `${parentPath}/${convertStringToPath(feature.name)}`;
      return (
        <Button sx={{ background: app.styles.primaryColor }} key={childPath} variant='contained' component={Link} to={childPath}>
          {feature.name}
        </Button>
      );
    });
  };

  return (
    <Box
      sx={{
        marginTop: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '50vh',
        width: '100%',
        gap: '24px',
      }}
    >
      {app ? renderFeatures(app) : renderApps()}
    </Box>
  );
}

export default Home;
