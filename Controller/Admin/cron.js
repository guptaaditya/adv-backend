const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();

const constants = require('../../constants');
const { Users: User } = require('../../db');

async function changePremiumToFreeForExpiredMembership() {
    console.log('Starting expiry of memberships');
    const currentDate = new Date();
    let expiredMembershipUsers;
    let expiredMembershipUsernames = [];
    try {
        expiredMembershipUsers = await User.find({ 
            isDeleted: false, 
            'membership.validTill': { $exists: true, $ne: null, $lte: currentDate },
        }, { username :1, _id:0 })
        expiredMembershipUsernames = _.map(expiredMembershipUsers, ({ username }) => username.trim());
    } catch (e) {
        console.log(e, 'error 1');
    }
    console.log(expiredMembershipUsernames);

    try {
        const updateFreeMembershipFor = await User.updateMany({ 
            isDeleted: false, 
            username: { $in: expiredMembershipUsernames },
        }, {
            membership: { ...constants.FREE_MEMBERSHIP },
        });
        if(updateFreeMembershipFor.nModified !== expiredMembershipUsernames.length) {
            console.log('Error updating the expiry of membership');
            console.log('expired for '+updateFreeMembershipFor.nModified);
            console.log('found expired '+expiredMembershipUsernames.length);
        } else {
            console.log('Expired membership for '+updateFreeMembershipFor.nModified+' users' );
        }
    } catch (e) {
        console.log(e, 'error 2');
    }
    console.log('Done');
}

changePremiumToFreeForExpiredMembership();