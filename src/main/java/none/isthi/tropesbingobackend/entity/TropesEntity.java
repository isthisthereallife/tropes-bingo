package none.isthi.tropesbingobackend.entity;

public class TropesEntity {
    private String title;
    private String address;
    private String description;
    private boolean ticked;

    public TropesEntity(){
        title = "Generic title";
        address= "www.example.com";
        description= "Generic Description";
        ticked = false;
    }

    public TropesEntity(String title, String address){
        this.title = title;
        this.address = address;
        this.description = "description goes here";
        this.ticked = false;
    }
    public TropesEntity(String title, String address, String description, boolean ticked){
        this.title = title;
        this.address = address;
        this.description = description;
        this.ticked = ticked;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isTicked() {
        return ticked;
    }

    public void setTicked(boolean ticked) {
        this.ticked = ticked;
    }

    @Override
    public String toString() {
        return "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'';
    }
}
