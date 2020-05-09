package io.rkb.ekodigital.rnfirebaseauthuimodule

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.firebase.ui.auth.AuthUI
import io.rkb.ekodigital.MainActivity
import io.rkb.ekodigital.R


class RNFirebaseAuthUIModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RNFirebaseAuthUI"
    }

    @ReactMethod
    fun launchSingInFlow(promise: Promise?) {
        val providers = arrayListOf(
                AuthUI.IdpConfig.EmailBuilder().build(),
                AuthUI.IdpConfig.PhoneBuilder().build(),
                AuthUI.IdpConfig.GoogleBuilder().build()
        )

        val signInIntent = AuthUI.getInstance()
                .createSignInIntentBuilder()
                .setAvailableProviders(providers)
                .setTheme(R.style.AuthTheme)
                .build()

        currentActivity?.startActivity(signInIntent)

        promise?.resolve(null)
    }

    @ReactMethod
    fun closeSingInFlow(promise: Promise?) {
        // TODO: find better way to close sign in activity
        val intent = Intent(reactApplicationContext, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        currentActivity?.startActivity(intent)

        promise?.resolve(null)
    }
}
