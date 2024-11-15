import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged as _onAuthStateChanged } from "firebase/auth"

import { auth } from "@/src/lib/firebase/clientApp"

export function onAuthStateChanged(cb) {
	return _onAuthStateChanged(auth, cb)
}

export async function signInWithGoogle() {
	const provider = new GoogleAuthProvider()

	try {
		// await signInWithPopup(auth, provider)
		let a = await signInWithEmailAndPassword(auth, "try@marcmuixi.me", "acapulco")
		console.log("LOGGED IN", a)
	} catch (error) {
		console.error("Error signing in with Google", error)
	}
}

export async function signOut() {
	try {
		return auth.signOut()
	} catch (error) {
		console.error("Error signing out with Google", error)
	}
}
