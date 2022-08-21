
import { Container, Grid, Paper, Typography } from "@mui/material";
import { Box } from '@mui/system';
import { useStyles_mainCard } from "../styles/general/main_card";

  
function PageWrapper({children}) {
  return <Container>
      {children}
  </Container>
}


function TermsPage() {
  const classes = useStyles_mainCard();

  return (    
      <PageWrapper>
        <Paper className={classes.content}>

          <Box
            component="main"
          >
              <Grid container spacing="1" alignItems="center">
                <Typography
                  variant="h6"
                  noWrap
                  marginLeft={1.5}
                  component="span">
                    Terms of Service
                </Typography>
              </Grid>


              <Grid
                container
                spacing={3}
              >
                <Box pt={5} pl={5} pr={2}>
                  TODO
                </Box>
              </Grid>
          </Box>

        </Paper>
      </PageWrapper>
  );

}

export default TermsPage;