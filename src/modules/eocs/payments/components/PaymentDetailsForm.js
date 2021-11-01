import {Select, TextField} from "mui-rff";
import {
    AvailableCurrencies,
    CurrencyType,
    PaymentManagerContext,
    PaymentType,
    Priority
} from "../services/PaymentProvider";
import {CountrySelect} from "../../../shared/components/CountrySelect";
import {Box, Button, Typography} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import {Form} from "react-final-form";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {FetchInterceptorContext} from "../../../shared/services/FetchInterceptorProvider";
import camelize from "camelize";
import {PBox} from "../../../shared/components/PBox";


export function PaymentDetailsForm(props){

    const intl = useIntl();
    const authc = useContext(AuthContext);
    const pmc = useContext(PaymentManagerContext);
    const fic = useContext(FetchInterceptorContext);

    const [methods, setMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const [priority, setPriority] = useState(Priority.PRIMARY);

    useEffect(() => {
        pmc.manager.getPaymentMethodsQuery().subscribe((v) => {
            if(v.isSuccess){
                setMethods(v.data['hydra:member']);
            }
        });
    }, []);

    const onSubmit = (formValue) => {
        let nv = {...camelize(formValue), ...{
            user: authc.manager.getUser()['@id'],
            method: selectedMethod['@id'],
            platform: selectedPlatform ? selectedPlatform['@id'] : null,
            status: priority === Priority.PRIMARY && !pmc.manager.hasPendingDetails() ? 'new-primary' : 'new',
        }};

        pmc.manager.getCreatePaymentDetailsQuery(nv, selectedMethod.codename).subscribe((v) => {
            console.log(v);
        });
    };

    const getCurrencyType = () => {
        return selectedMethod.codename === PaymentType.CRYPTO ? CurrencyType.CRYPTO : CurrencyType.REAL;
    }

    const isAvailableInCountry = (entity) => {
        if(!authc.manager.getUser()){
            return false;
        }
        let userCountry = authc.manager.getUser().country;
        return entity.countryWhiteList.length > 0 ? entity.countryWhiteList.includes(userCountry) : !entity.countryBlackList.includes(userCountry);
    }

    const getAvailableMethods = () => {
        let ret = [];
        for(let m of methods){
            if(isAvailableInCountry(m)){
                ret.push(m);
            }
        }
        return ret;
    }

    const getAvailablePlatforms = () => {
        let ret = [];
        for(let p of selectedMethod.platforms){
            if(isAvailableInCountry(p)) {
                ret.push(p);
            }
        }
        return ret;
    }

    return (
        <PBox>
            <Typography variant={'h4'}>
                <FormattedMessage id={'payment.text.payment_detail.create'}/>
            </Typography>

            <Form onSubmit={onSubmit}
                  render={({ handleSubmit, values }) => (
                      <form onSubmit={handleSubmit}>

                          {pmc.manager.getAvailablePriorities().length > 1 && <Select name="priority"
                                  label={intl.formatMessage({id: "payment.field.payment_details.priority"})}
                                  required={true}
                                  value={priority}
                                  onChange={(e)=> {setPriority(e.target.value)}}
                                  data={Object.keys(Priority).map(k => ({
                                      label: intl.formatMessage({id: `payment.field.payment_details.priority.${Priority[k]}`}),
                                      value: Priority[k]
                                  }))}
                          />}

                          <Select name="method"
                                  label={intl.formatMessage({id: "payment.field.method"})}
                                  required={true}
                                  value={selectedMethod}
                                  onChange={(e)=> {setSelectedMethod(e.target.value)}}
                                  data={getAvailableMethods().map(m => ({
                                      label: intl.formatMessage({id: `payment.field.method.${m.codename}`}),
                                      value: m
                                  }))}
                          />

                          {selectedMethod && <>
                              <Select name="currency"
                                      label={intl.formatMessage({id: "payment.field.currency"})}
                                      required={true}
                                      data={AvailableCurrencies[getCurrencyType()].map(v => ({
                                          label: v,
                                          value: v
                                      }))}
                              />

                              {selectedMethod.codename === PaymentType.WIRE_TRANSFER && <>
                                  <TextField name="account_holder_name"
                                             label={intl.formatMessage({id: "payment.field.wire.account_holder_name"})}
                                             required={true}
                                  />
                                  <CountrySelect name="country"
                                                 label="form.country"
                                                 required={true}
                                  />

                                  <TextField name="beneficiary_bank_name"
                                             label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_name"})}
                                             required={true}
                                  />
                                  <TextField name="beneficiary_bank_address"
                                             label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_address"})}
                                             required={true}
                                  />
                                  <TextField name="beneficiary_bank_account_iban"
                                             label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_account_iban"})}
                                             required={true}
                                  />
                                  <TextField name="beneficiary_bank_swift"
                                             label={intl.formatMessage({id: "payment.field.wire.beneficiary_bank_swift"})}
                                             required={true}
                                  />

                              </>}

                              {selectedMethod.codename === PaymentType.PSP && <>
                                  <Select name="platform"
                                          label={intl.formatMessage({id: "payment.field.psp.platform"})}
                                          required={true}
                                          value={selectedPlatform}
                                          onChange={(e)=> {setSelectedPlatform(e.target.value)}}
                                          data={getAvailablePlatforms().map(p => ({
                                              label: p.displayName,
                                              value: p
                                          }))}
                                  />

                                  <TextField name="account_holder_name"
                                             label={intl.formatMessage({id: "payment.field.psp.account_holder_name"})}
                                             required={true}
                                  />
                                  <TextField name="wallet_number_email"
                                             label={intl.formatMessage({id: "payment.field.psp.wallet_number_email"})}
                                             required={true}
                                  />
                              </>}

                              {selectedMethod.codename === PaymentType.OCT && <>
                                  <TextField name="card_holder_name"
                                             label={intl.formatMessage({id: "payment.field.oct.card_holder_name"})}
                                             required={true}
                                  />
                                  <TextField name="card_number"
                                             label={intl.formatMessage({id: "payment.field.oct.card_number"})}
                                             required={true}
                                  />
                                  <TextField name="card_expiry"
                                             label={intl.formatMessage({id: "payment.field.oct.card_expiry"})}
                                             required={true}
                                  />
                              </>}

                              {selectedMethod.codename === PaymentType.CRYPTO && <>
                                  <TextField name="platform"
                                             label={intl.formatMessage({id: "payment.field.crypto.platform"})}
                                             required={true}
                                  />
                                  <TextField name="wallet_number"
                                             label={intl.formatMessage({id: "payment.field.crypto.wallet_number"})}
                                             required={true}
                                  />
                              </>}
                          </>}

                          <Box mt={2}>
                              <Button type="submit"
                                      variant="contained"
                                      disabled={fic.loading}
                              >
                                  <FormattedMessage id={'payment.action.details_create'}/>
                              </Button>
                          </Box>
                      </form>
                  )}
            />
        </PBox>
    );
}
