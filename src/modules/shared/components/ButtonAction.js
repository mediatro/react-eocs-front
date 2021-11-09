import {useContext} from "react";
import {FetchInterceptorContext} from "../services/FetchInterceptorProvider";
import {Button} from "@mui/material";

export function ButtonAction(props){

    const fic = useContext(FetchInterceptorContext);

    return (
        <Button {...props}
                disabled={fic.loading}
        >
            {props.children}
        </Button>
    );
}
