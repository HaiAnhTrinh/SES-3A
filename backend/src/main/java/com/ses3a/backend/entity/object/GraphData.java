package com.ses3a.backend.entity.object;

public class GraphData {
    String date;
    String revenue;

    public GraphData(String date, String revenue){
        this.date = date;
        this.revenue = revenue;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getRevenue() {
        return revenue;
    }

    public void setRevenue(String revenue) {
        this.revenue = revenue;
    }
}
