# Presentation
A simple webservice to save badges/shields like:

![Badge Status](https://img.shields.io/badge/badge-status-brightGreen)

You can create as many badges as needed for a project.

Ex: build, test, deploy, ...

And customize left label, right label, right color.

# Stack
- Webservices: Firebase cloud functions
- Database: Firestore
- Image generator: https://img.shields.io/

# Setup
1) Create a Firebase project.

2) Import rules and cloud functions from this project:
- `firestore.rules`
- `functions/src/index.ts`

3) Open Firebase console/Firestore to create :
- a collection named `projects`
- a project document with a single `token` string property

The path looks like:
`projects/{project_id}`

`project_id`: you should choose a human readable name.

`token`: fill it with a random key, it will be required to create a badge.

# Structure
## Project model
```
token: string
```

## Badge model
```
label: string
color: string
```

Badges are stored under a project document:

`projects/{project_id}/badges/{badge_id}`

# How to use
## Create or update a badge

Call route `setBadge` with these parameters:
- project: name
- badge: left text
- label: right text
- color: an english color name (green, red, orange, brightgreen, ...)
- token: the key to get a write permission

```
https://xxx.cloudfunctions.net/setBadge?project=skyrocket&badge=launch&label=success&color=green&token=yolo
```

## Get a badge image
Call route `getBadge` with these parameters:
- project: name
- badge: left text

```
https://xxx.cloudfunctions.net/getBadge?project=skyrocket&badge=launch
```
![Badge Status](https://img.shields.io/badge/launch-success-green)

## Markdown
```
![Build Status](https://xxx.cloudfunctions.net/getBadge?project=skyrocket&badge=build)
```

## Continuous Integration tool
Add a simple bash script step with a curl command:
```
curl "https://xxx.cloudfunctions.net/setBadge?project=skyrocket&badge=deploy&label=moon&color=blue"
```

# Contributing
Contributions are welcome. Please open up an issue in GitHub or submit a PR.

# Acknowledgements
Thanks to https://shields.io/ for their public image generator.

Thanks to Firebase for their free backend.
https://firebase.google.com/
