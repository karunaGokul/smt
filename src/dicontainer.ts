import { Vue, Provide } from "vue-property-decorator";

import { IUserService, UserService } from '@/service';
import { ITrialService, TrialService } from '@/service';
import { IPlanService, PlanService } from '@/service';
import { IDiscountService, DiscountService } from '@/service';
import { IChannelService, ChannelService } from '@/service';
import { IAddOnService, AddOnService } from '@/service';
import { ISubscriptionService, SubscriptionService } from '@/service';
import { PlanAddOnService, IPlanAddOnService } from '@/service';


export class DIContainer extends Vue {
    @Provide('trialService') trialService: ITrialService = new TrialService();
    @Provide('userService') userService: IUserService = new UserService();
    @Provide('subscriptionService') subscriptionService: ISubscriptionService = new SubscriptionService();
    @Provide('planService') planService: IPlanService = new PlanService();
    @Provide('discountService') discountService: IDiscountService = new DiscountService();
    @Provide('addOnService') addOnService: IAddOnService = new AddOnService();
    @Provide('channelService') channelService: IChannelService = new ChannelService();
    @Provide('planAddOnService') PlanAddOnService: IPlanAddOnService = new PlanAddOnService();
}