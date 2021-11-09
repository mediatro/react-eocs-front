import {useContext, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {SPaper} from "../../../shared/components/SPaper";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {switchMap, NEVER, take} from "rxjs";
import {PaymentManagerContext} from "../services/PaymentProvider";
import {Box} from "@mui/material";

export function PaymentRequestConfirmation(){

    let location = useLocation();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);

    useEffect(() => {
        let tokenFromQuery = new URLSearchParams(location.search).get('token');
        let idFromQuery = new URLSearchParams(location.search).get('id');

        if(tokenFromQuery && idFromQuery) {
            let nv = {
                requestId: idFromQuery,
                token: tokenFromQuery,
            };

            authc.manager.userChanged$.pipe(
                switchMap(user => user.id ? pmc.manager.getUpdatePaymentRequestQuery(nv) : NEVER),
                take(1)
            ).subscribe(v => {
                console.log('moo')
            });
        }
    }, []);

    return (
        <Box>
            Validating...
        </Box>
    );

}
