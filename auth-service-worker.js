import { initializeApp } from "firebase/app"
import { getAuth, getIdToken } from "firebase/auth"
import { getInstallations, getToken } from "firebase/installations"

// this is set during install
let firebaseConfig

self.addEventListener("install", (event) => {
	console.log("Service worker install")
	// extract firebase config from query string
	const serializedFirebaseConfig = new URL(location).searchParams.get("firebaseConfig")

	if (!serializedFirebaseConfig) {
		throw new Error("Firebase Config object not found in service worker query string.")
	}

	firebaseConfig = JSON.parse(serializedFirebaseConfig)
	console.log("Service worker installed with Firebase config", firebaseConfig)
})

self.addEventListener("fetch", (event) => {
	console.log("Service worker fetch")
	console.log("fetch (root)", event.request.url)
	const { origin } = new URL(event.request.url)
	if (origin !== self.location.origin) return
	event.respondWith(fetchWithFirebaseHeaders(event.request))
})

async function fetchWithFirebaseHeaders(request) {
	console.log("Service worker fetchWithFirebaseHeaders")
	console.log("fetchWithFirebaseHeaders (root)", request.url)
	const app = initializeApp(firebaseConfig)
	const auth = getAuth(app)
	const installations = getInstallations(app)
	const headers = new Headers(request.headers)
	const [authIdToken, installationToken] = await Promise.all([getAuthIdToken(auth), getToken(installations)])
	headers.append("Firebase-Instance-ID-Token", installationToken)
	if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`)
	const newRequest = new Request(request, { headers })
	return await fetch(newRequest)
}

async function getAuthIdToken(auth) {
	console.log("Service worker getAuthIdToken")
	await auth.authStateReady()
	if (!auth.currentUser) return
	return await getIdToken(auth.currentUser)
}
