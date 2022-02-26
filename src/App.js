
import React, { useState } from 'react';

import { PaletteMode, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from './theme/theme';

import Button from '@mui/material/Button';
import { amber, deepOrange, grey } from '@mui/material/colors';

import CssBaseline from '@mui/material/CssBaseline';

import Cookies from 'universal-cookie';
import TopNavBar from './components/TopNavBar';
import PortfoliosPage from './pages/portfolios';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { link_forgot_password, link_login, link_portfolios, link_portfolio_matcher, link_report_matcher, link_root, link_signup } from './links/links';
import { DashboardPage } from './pages/dashboard';
import PortfolioPage from './pages/portfolio';
import ReportPage from './pages/report';
import LoginPage from './pages/auth/login';
import SignupPage from './pages/auth/singup';
import ForgotPasswordPage from './pages/auth/forgot_password';
import { getToken } from './controller/auth/auth';
import { SnackbarProvider } from 'notistack';

function App() {
  const cookies = new Cookies();

  var _prefDark = useMediaQuery('(prefers-color-scheme: dark)');
  console.log("useMediaQuery: ", _prefDark);
  const [prefMode, setPrefMode] = useState(0); // prefs: 0=notset, 1=light, 2=dark

  const _prefCookie = cookies.get('darkMode');
  if (_prefCookie !== undefined && _prefCookie !== null) {
    const newPrefMode = (_prefCookie==="true" ? 1 : 0) + 1;
    if (newPrefMode != prefMode) setPrefMode(newPrefMode);
  }

  // cookies.set('darkMode', true, { path: '/' });

  const theme = React.useMemo(() => 
    prefMode===0 
      ? (_prefDark ? darkTheme : lightTheme) 
      : (prefMode===2 ? darkTheme : lightTheme), [prefMode, _prefDark]);

  const [token, setToken] = useState(getToken());

  return (
    <SnackbarProvider maxSnack={4}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <TopNavBar />
          <CssBaseline />
          {
            (token) ? (
              <Routes>
                <Route path={link_login} element={<Navigate to={link_portfolios} />} />
                <Route path={link_signup} element={<Navigate to={link_portfolios} />} />
                <Route path={link_forgot_password} element={<Navigate to={link_portfolios} />} />
    
                <Route path={link_root} element={<DashboardPage />} />
                <Route path={link_portfolios} element={<PortfoliosPage token={token} />} />
                <Route path={link_report_matcher} element={<ReportPage />} />
                <Route path={link_portfolio_matcher} element={<PortfolioPage token={token} />} />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>404 - Page not found!</p>
                    </main>
                  }
                />
              </Routes>
            ) : ( /* not logged in */
              <Routes>
                <Route path={link_login} element={<LoginPage setToken={setToken} />} />
                <Route path={link_signup} element={<SignupPage />} />
                <Route path={link_forgot_password} element={<ForgotPasswordPage />} />
    
                <Route path={link_root} element={<DashboardPage />} />
                <Route path={link_portfolios} element={<Navigate to={link_login} />} />
                <Route path={link_report_matcher} element={<Navigate to={link_login} />} />
                <Route path={link_portfolio_matcher} element={<Navigate to={link_login} />} />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>404 - Page not found!</p>
                    </main>
                  }
                />
              </Routes>
            )
          }
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
