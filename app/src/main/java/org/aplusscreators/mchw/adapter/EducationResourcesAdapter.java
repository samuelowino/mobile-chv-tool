package org.aplusscreators.mchw.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import org.aplusscreators.mchw.R;
import org.aplusscreators.mchw.model.EducationResource;

import java.util.List;

public class EducationResourcesAdapter extends RecyclerView.Adapter<EducationResourcesAdapter.ViewHolder>{

    List<EducationResource> educationResourceList;
    Context context;
    OnEducationResourceClickedListener educationResourceClickedListener;

    public EducationResourcesAdapter(List<EducationResource> educationResourceList, Context context,OnEducationResourceClickedListener educationResourceClickedListener) {
        this.educationResourceList = educationResourceList;
        this.context = context;
        this.educationResourceClickedListener = educationResourceClickedListener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_education_resource,parent,false);
        return new ViewHolder(view,educationResourceClickedListener);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ViewHolder viewHolder = (ViewHolder)holder;
        EducationResource educationResource = educationResourceList.get(position);
        viewHolder.titleTextView.setText(educationResource.getTitle());
        viewHolder.descriptionTextView.setText(educationResource.getDescription());
        viewHolder.coverImageView.setImageDrawable(context.getResources().getDrawable(educationResource.getDrawableResourceId()));
    }

    @Override
    public int getItemCount() {
        return educationResourceList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        TextView titleTextView;
        TextView descriptionTextView;
        View parentContainer;
        ImageView coverImageView;

        OnEducationResourceClickedListener onEducationResourceClickedListener;

        public ViewHolder(@NonNull View itemView, OnEducationResourceClickedListener educationResourceClickedListener) {
            super(itemView);

            titleTextView = itemView.findViewById(R.id.item_all_education_resources_title_text_view);
            descriptionTextView = itemView.findViewById(R.id.item_all_education_resources_description_text_view);
            parentContainer = itemView.findViewById(R.id.item_all_resource_layout_container);
            coverImageView = itemView.findViewById(R.id.item_all_education_resources_image_view);
            onEducationResourceClickedListener = educationResourceClickedListener;

            parentContainer.setOnClickListener(this);
        }

        @Override
        public void onClick(View view) {
            educationResourceClickedListener.onEducationResourceClicked(getAdapterPosition());
        }
    }

    public interface OnEducationResourceClickedListener {
        public void onEducationResourceClicked(int postition);
    }
}
