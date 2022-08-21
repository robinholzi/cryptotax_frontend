
import { Box, Breadcrumbs, Typography } from '@mui/material';
import Link from '@mui/material/Link';

// items: [{title, href, icon}, {...}]
export const CryptoTaxBreadcrubs = ({items}) => {

  const mappedItems = items.map(({title, href, icon}) => {
    if (String(href).length < 1) {
      return <Typography
        sx={{ display: 'flex', alignItems: 'center' }}
        color="text.primary"
        key={String(title).concat(href)}
      >
        {icon ?? ''}
        {title}
      </Typography>;
    } else {
      return <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href={href}
        key={String(title).concat(href)}
      >
        {icon ?? ''}
        {title}
      </Link>
    }
  })

  return <Box pt={4}>
    <Breadcrumbs aria-label="breadcrumb" 
      onClick={(e) => {
        console.log(e.target.value)
      }}
      children={mappedItems}
    />
  </Box>

}