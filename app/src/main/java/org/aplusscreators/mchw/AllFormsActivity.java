package org.aplusscreators.mchw;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AllFormsActivity extends AppCompatActivity {

    private static final String TAG = "AllFormsActivity";
    public static final String SERIALIZED_FORM_ENTRY_KEY = "serialized_form_entry_key";

    RecyclerView allFormsRecyclerView;
    AllFormsAdapter formsAdapter;
    List<Form> formList = new ArrayList<>();
    ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_all_forms);

        allFormsRecyclerView = findViewById(R.id.all_forms_recycler_view);

        formsAdapter = new AllFormsAdapter(formList, AllFormsActivity.this, new AllFormsAdapter.OnFormClickedListener() {
            @Override
            public void onFormClicked(int postition) {
                try {
                    Form form = formList.get(postition);
                    Intent intent = new Intent(AllFormsActivity.this, FormsWebViewActivity.class);
                    String formSerialized = objectMapper.writeValueAsString(form);
                    intent.putExtra(SERIALIZED_FORM_ENTRY_KEY,formSerialized);
                    startActivity(intent);
                    finish();
                } catch (Exception ex) {
                    Log.e(TAG, "onFormClicked: " + ex.getMessage() );

                }

            }
        });

        allFormsRecyclerView.addItemDecoration( new DividerItemDecoration(AllFormsActivity.this,DividerItemDecoration.VERTICAL));
        allFormsRecyclerView.setLayoutManager( new LinearLayoutManager(AllFormsActivity.this));
        allFormsRecyclerView.setAdapter(formsAdapter);
    }

    @Override
    protected void onStart() {
        super.onStart();
        formList.add( new Form(UUID.randomUUID().toString(),"Immunization Form","The importance of immunization is so great that the American Centers for Disease Control and Prevention has named it one of the \"Ten Great Public Health Achievements in the 20th Century\".","chw"));
        formList.add( new Form(UUID.randomUUID().toString(),"Sanitation Form","Sanitation refers to public health conditions related to clean drinking water and adequate treatment and disposal of human excreta and sewage.","chw"));
        formList.add( new Form(UUID.randomUUID().toString(),"Demographics Form","This is a cHW for for health providers","chw"));
        formList.add( new Form(UUID.randomUUID().toString(),"Referrals Form","In medicine, referral is the transfer of care for a patient from one clinician or clinic to another by request.","chw"));

        formsAdapter.notifyDataSetChanged();
    }
}
