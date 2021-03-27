import * as functions from "firebase-functions";
import * as admin from 'firebase-admin'

admin.initializeApp()
const firestore = admin.firestore()

// Check if service is running
export const hello = functions.https.onRequest((request, response) => {
  response.send("Hello !");
});

// Get a badge SVG image
// Expected GET parameters: project, badge.
export const getBadge = functions.https.onRequest(async (request, response) => {
	// Check required parameters
	let projectId: string = request.query.project as string;
	let badgeId: string = request.query.badge as string;
	
	if (!projectId || !badgeId) {
		response.send('Missing parameters. Expected: project, badge.');
	}

	// Check if the project exists
	const projectRef = firestore.collection('projects').doc(projectId);
	const project = await projectRef.get();
	if (!project.exists) {
	  response.send('No such project! You must create it in Firestore.');
	}

	// Create or update the badge
	const badgeRef = projectRef.collection('badges').doc(badgeId);
	const badge = await badgeRef.get();
	if (!badge.exists) {
	  response.send('No such badge!');
	}

	const badgeData = badge.data();
	if(!badgeData) {
		response.send('No data for this badge!');
	}

	const label = badgeData!.label ?? "no-label" as string;
	const color = badgeData!.color ?? "red" as string;

	let imageUrl = `https://img.shields.io/badge/${badgeId}-${label}-${color}`;
	response.redirect(imageUrl);
});

// Create or update a badge
// Expected GET parameters: project, badge, label, color.
export const setBadge = functions.https.onRequest(async (request, response) => {
	// Check required parameters
	let projectId: string = request.query.project as string;
	let badgeId: string = request.query.badge as string;
	let label: string = request.query.label as string;
	let color: string = request.query.color as string;

	if (!projectId || !badgeId || !label || !color) {
		response.send('Missing parameters. Expected: project, badge, label, color.');
	}

	// Check if the project exists
	const projectRef = firestore.collection('projects').doc(projectId);
	const project = await projectRef.get();
	if (!project.exists) {
	  response.send('No such project! You must create it in Firestore.');
	}

	// Create or update the badge
	projectRef.collection('badges').doc(badgeId).set({
	    label: label,
	    color: color
	})
	.then(() => {
	    response.send("Badge successfully written!");
	})
	.catch((error) => {
	    response.send("Error writing badge: " + error);
	});
});