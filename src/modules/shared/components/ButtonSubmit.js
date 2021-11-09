import {FormattedMessage} from "react-intl";
import {Button} from "@mui/material";
import {useContext} from "react";
import {FetchInterceptorContext} from "../services/FetchInterceptorProvider";

export function ButtonSubmit(props){

    const fic = useContext(FetchInterceptorContext);

    return (
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={fic.loading}
        >
            {props.children}
        </Button>
    );
}
