

function ErrorWidget(errorText) {

  return <Card>
    <Alert variant="filled" severity="error">
      {errorText}
    </Alert>
  </Card>

}

export default ErrorWidget;