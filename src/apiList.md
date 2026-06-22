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
- POST /request/send/:status/:userId

- POST /request/review/:status/:userId

## userRouter
- GET /connections
- GET /requests/received
- GET /feed - gets you the profiles of outher users on platform

STATUS: ignore, intrested, accepted, rejected
