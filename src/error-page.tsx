import { AxiosError } from "axios";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error instanceof AxiosError ? 400 || error.message : null}</i>
      </p>
    </div>
  );
}
