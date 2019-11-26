package org.aplusscreators.mchw;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class AllFormsAdapter extends RecyclerView.Adapter<AllFormsAdapter.ViewHolder>{

    List<Form> formList;
    Context context;
    OnFormClickedListener onFormClickedListener;

    public AllFormsAdapter(List<Form> formList, Context context,OnFormClickedListener onFormClickedListener) {
        this.formList = formList;
        this.context = context;
        this.onFormClickedListener = onFormClickedListener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_all_forms_layout,parent,false);

        return new ViewHolder(view, onFormClickedListener);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ViewHolder viewHolder = (ViewHolder)holder;
        Form form = formList.get(position);
        viewHolder.formTitleTextView.setText(form.getTitle());
        viewHolder.formDescriptionTextView.setText(form.getDescription());
    }

    @Override
    public int getItemCount() {
        return formList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        View parentContainer;
        TextView formTitleTextView;
        TextView formDescriptionTextView;
        OnFormClickedListener onFormClickedListener;

        public ViewHolder(@NonNull View itemView,OnFormClickedListener onFormClickedListener) {
            super(itemView);

            parentContainer = itemView.findViewById(R.id.item_all_forms_layout_container);
            formTitleTextView = itemView.findViewById(R.id.item_all_forms_form_title_text_view);
            formDescriptionTextView = itemView.findViewById(R.id.item_all_forms_form_description_text_view);

            this.onFormClickedListener = onFormClickedListener;

            parentContainer.setOnClickListener(this);
        }

        @Override
        public void onClick(View view) {
            onFormClickedListener.onFormClicked(getAdapterPosition());
        }
    }

    public interface OnFormClickedListener {
        public void onFormClicked(int postition);
    }
}
