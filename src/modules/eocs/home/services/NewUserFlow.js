import {useContext} from "react";
import {AuthContext} from "../../../shared/services/AuthProvider";
import {UserManagerContext} from "../../auth/services/UserManagerProvider";
import {PaymentManagerContext} from "../../payments/services/PaymentProvider";

export const Steps = {
    REGISTER: 'page.register',
    PAYMENT_DETAILS: 'page.payment_details',
    COMPLIANCE: 'home.text.stepper.compliance',
    OFFERS: 'home.text.stepper.offers',
}

export class NewUserFlow {

    authc = null;
    umc = null;
    pmc = null;

    getUser(){
        return this.authc.manager.getUser();
    }

    isRegisterComplete(){
        return this.getUser() && this.getUser().id;
    }

    isPaymentDetailsComplete(){
        return this.getUser().paymentDetails && this.getUser().paymentDetails.length > 0;
    }

    isComplianceComplete(){
        const availableSiteRecords = this.getUser().availableSiteRecords;
        if(availableSiteRecords){
            for(let record of availableSiteRecords){
                if(record){
                    return true;
                }
            }
        }
        return false;
    }

    isOffersComplete(){
        const availableSiteRecords = this.getUser().availableSiteRecords;
        if(availableSiteRecords){
            for(let record of availableSiteRecords){
                if(record && record.consented){
                    return true;
                }
            }
        }
        return false;
    }

    getActiveStepNumber(){
        let ret = 0;
        if(this.isRegisterComplete()){
            ret+= 1;
            if(this.isPaymentDetailsComplete()){
                ret+= 1;
                if(this.isComplianceComplete()){
                    ret+= 1;
                }
            }
        }
        return ret;
    }

    getActiveStepString(){
        return Steps[Object.keys(Steps)[this.getActiveStepNumber()]];
    }

    isEverythingComplete(){
        return this.getActiveStepNumber() === Object.keys(Steps).length - 1 && this.isOffersComplete();
    }

}

const flow = new NewUserFlow();

export function useNewUserFlow(){

    flow.authc = useContext(AuthContext);
    flow.umc = useContext(UserManagerContext);
    flow.pmc = useContext(PaymentManagerContext);

    return flow;

}
