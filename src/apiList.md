# DevTinder API's


## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/accepted/:userId
- POST /request/send/rejected/:userId

## userRouter
- GET /connections
- GET /requests/received
- GET /feed - gets you the profiles of outher users on platform

STATUS: ignore, intrested, accepted, rejected
