package com.ses3a.backend.entity.response;

import com.ses3a.backend.entity.object.GraphData;

import java.util.List;

public class GetGraphDataResponse extends BaseResponse{

    List<GraphData> data;

    public GetGraphDataResponse(){
    }

    public List<GraphData> getData() {
        return data;
    }

    public void setData(List<GraphData> data) {
        this.data = data;
    }
}
