import User from '../models/User';
import {Router, Request, Response} from 'express';
import bcrypt from 'bcrypt';
import Session from '../models/Session';



const router = Router();
const saltRounds = 3; // 12+ for production. Will be used in register route

router.post('/login', async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
  
    const user = await User.findOne({email}).select('+password');
  
    if (user) {
      const passMatched = await bcrypt.compare(password, user.password);
      if (passMatched) {
        const session = await Session.create({userID: user._id});
        res.cookie('session', session._id, { signed: true, httpOnly: true });
        
        return res.sendStatus(200);
      }
    }
  
    return res.send(400);
  } catch(e) {
    console.log(e)
    res.status(400).json(e);
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
      const { email, password } = req.body;

        if (!(/^(?=.*[(*@%$)])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password))) {
            return res.status(422).json({err: `${password} is not a valid password. Please ensure the password matches the following rules: \n \t A special character must be included: (*@%$) \n\t * At least one capital letter \n\t * At least one number`}) 
        }

    
      const hashedPass = await bcrypt.hash(password, saltRounds);
  
      const user = await User.create({
        email: email,
        password: hashedPass
      })
  
      return res.sendStatus(200);
    } catch(e) {
      res.status(400).json(e);
    }
});


module.exports = router;