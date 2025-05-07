import { Webhook } from "svix";

import  User from "../models/User.js";
import Stripe from "stripe"
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// API controller Function to Mange clerk User with database

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    await whook.verify(JSON.stringify(req.body),{
    "svix-id":req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"]
  })

  const {data,type} = req.body

  switch(type){
    case 'user.created':{
        const userData = {
          _id: data.id,
          name: data.first_name +  "" + data.last_name,
          email: data.email_addresses[0].email_address,
          imageUrl: data.image_url
        }
        await User.create(userData)
        res.json({})
      break;
    }
    case 'user.updated':{
      const userData = {
        
        name: data.first_name +  "" + data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url
      }
      await User.findByIdAndUpdate( data.id , userData)
      res.json({})
      break;
    }

    case 'user.deleted':{
      await User.findByIdAndDelete(data.id)
      res.json({})
      break;
    }

    default:
      break;
  }

   } catch (error) {
    res.json({success:false, message: error.message})
  }
}


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
export const stripeWebhooks = async (req, res) => {

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

switch(event.type){
  case'payment_intent.succeeded':{
    const paymentIntent = event.data.object;
    const paymentId = paymentIntent.id;

    const session = await stripeInstance.checkout
    .sessions.list({
      payment_intent: paymentId,
     
    });
    
  const  {purchasedId} = session.data[0].metadata;

  const purchaseData = await Purchase.findById(purchasedId);

  const userData = await User.findById(purchaseData.userId);

  const courseData = await Course.findById(purchaseData.courseId.toString());

  courseData.enrolledStudents.push(userData)

  await courseData.save();

  userData.enrolledCourses.push(courseData._id)
  await userData.save();

  purchaseData.status = "Completed";
  await purchaseData.save();
    break;
  }

  case 'payment_intent.payment_failed':
    {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;

      
    const session = await stripeInstance.checkout
    .sessions.list({
      payment_intent: paymentId,
     
    });
    const {purchasedId} = session.data[0].metadata
   
    const purchaseData = await Purchase.findById(purchasedId);

    purchaseData.status = "Failed";
    await purchaseData.save();

    break;
  }
  default:
    console.log("Unhandled event type:", event.type);

    // return a response to acknowledege of the event
    res.json({ received: true });
    
}
}