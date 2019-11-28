package org.aplusscreators.mchw.web;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.aplusscreators.mchw.view.AllFormsActivity;

public class AppJavascriptInterface {

    AppCompatActivity context;

    public AppJavascriptInterface(AppCompatActivity context) {
        this.context = context;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(AppCompatActivity context) {
        this.context = context;
    }

    @JavascriptInterface
    public void saveCHVForm(){
        Toast.makeText(context,"Form Data Saved",Toast.LENGTH_LONG).show();
        Intent intent = new Intent(context, AllFormsActivity.class);
        context.startActivity(intent);
    }
}
