import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Link, useLocation} from "react-router-dom";
import {Form} from "react-final-form";
import {Select, TextField} from "mui-rff";
import {useContext, useEffect, useState} from "react";
import {PaymentManagerContext} from "../services/PaymentProvider";
import camelize from "camelize";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import {ActivePaymentRequests} from "./ActivePaymentRequests";
import {OnChange} from "react-final-form-listeners";
import {ContainerSmall} from "../../../shared/components/ContainerSmall";
import {SPaper} from "../../../shared/components/SPaper";
import {ButtonSubmit} from "../../../shared/components/ButtonSubmit";
import {MessageWarning} from "../../../shared/components/MessageWarning";
import {ContainerMid} from "../../../shared/components/ContainerMid";
import {TCardTitle} from "../../../shared/components/TCardTitle";
import {TKeyValueInline} from "../../../shared/components/TKeyValueInline";

export function PaymentRequestPage(){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const [amount, setAmount] = useState(0);
    const [site, setSite] = useState(null);

    const getActivePaymentDetail = () => authc.manager.getUser()['activePaymentDetail'];

    const onSubmit = (formValue) => {
        let nv = {...camelize(formValue), ...{
            amount: parseFloat(formValue.amount),
            detail: getActivePaymentDetail()['@id'],
            siteHistoryRecord: site['@id'],
        }};

        pmc.manager.getCreatePaymentRequestQuery(nv).subscribe((v) => {
            console.log(v);
        });
    };

    const getAvailableSiteRecords = () => {
        return authc.manager.getUser().availableSiteRecords || [];
    }

    return (
        <ContainerMid>
            <Grid item xs md={6}>
                <SPaper>
                    <TCardTitle>
                        <FormattedMessage id={'payment.text.payment_request.create'}/>
                    </TCardTitle>



                    {pmc.manager.isPaymentRequestBlocked() ? <>
                        <MessageWarning>
                            <Typography variant={'h6'}>
                                <FormattedMessage id={'payment.text.payment_request.blocked'}/>
                            </Typography>
                            <FormattedMessage id={`payment.text.payment_request.blocked.${pmc.manager.isPaymentRequestBlocked()}`}/>
                        </MessageWarning>

                    </> : <>
                        <TKeyValueInline
                            tkey={<><FormattedMessage id={'payment.field.payment_detail.limit'}/>(USD)</>}
                            value={getActivePaymentDetail() ? getActivePaymentDetail().payLimit : '0'}
                        />

                        <Form
                            onSubmit={onSubmit}
                            render={({ handleSubmit, values }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box sx={{ mt: 1, mb: 1 }}>
                                        <Select name="site"
                                                label={intl.formatMessage({id: "user.field.site"})}
                                                required={true}
                                                value={site}
                                                onChange={(e)=> {setSite(e.target.value)}}
                                                data={getAvailableSiteRecords().map(record => ({
                                                    label: record.site.name,
                                                    value: record
                                                }))}
                                        />
                                    </Box>

                                    <TextField name="amount" type={'number'}
                                               label={intl.formatMessage({id: "payment.field.amount"})}
                                               required={true}
                                               value={amount}
                                               inputProps={{ inputMode: 'numeric' }}
                                               sx={{ mt: 1, mb: 1 }}
                                    />
                                    <OnChange name="amount">
                                        {(value, previous) => {
                                            setAmount(Math.min(value, getActivePaymentDetail().payLimit));
                                        }}
                                    </OnChange>

                                    <ButtonSubmit>
                                        <FormattedMessage id={'payment.action.payment_request.submit'}/>
                                    </ButtonSubmit>
                                </form>
                            )}
                        />
                    </>}
                </SPaper>
            </Grid>

            <Grid item xs md={12}>
                <ActivePaymentRequests/>
            </Grid>
        </ContainerMid>
    );
}
