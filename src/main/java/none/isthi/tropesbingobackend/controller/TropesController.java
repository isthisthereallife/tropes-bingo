package none.isthi.tropesbingobackend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import none.isthi.tropesbingobackend.entity.SearchResultEntity;
import none.isthi.tropesbingobackend.entity.TropesEntity;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collections;

@RestController
@RequestMapping("/tropesbingo/")
public class TropesController {

    @GetMapping("search/{query}/{pageNumber}")
    public String searchForItem(@PathVariable String query, @PathVariable int pageNumber) throws IOException {
        try {
            Document searchDoc = Jsoup.connect("https://tvtropes.org/pmwiki/elastic_search_result.php?q=" + query + "&page_type=work&search_type=article&page=" + pageNumber).get();
            Elements searchResults = searchDoc.select("a.search-result");
            ArrayList<SearchResultEntity> searchResultEntities = new ArrayList<>();

            for (Element e : searchResults) {
                String img = e.select("img").attr("src").contains("search-noImage") ? "https://tvtropes.org/img/search-noImage-422x242.jpg" : e.select("img").attr("src");
                SearchResultEntity sRe = new SearchResultEntity(e.select("p:eq(0)").text(), e.text().substring(e.select("p:eq(0)").text().length()), img, e.attributes().get("href"));
                searchResultEntities.add(sRe);
            }
            ObjectMapper om = new ObjectMapper();
            return om.writeValueAsString(searchResultEntities);
        } catch (MalformedURLException e) {
            return null;
        }
    }


    @PostMapping("/{gridSizeInt}")
    public String getTropes(@PathVariable int gridSizeInt, @RequestBody String url) throws JsonProcessingException {
        //supplying the end part of a url to a film
        //cut out the tropes, add to this list
        int gridSize = gridSizeInt;
        if (5 <= gridSize) gridSize = 5;

        ArrayList<TropesEntity> tropeList = new ArrayList<>();

        try {
            Document tropeDoc = Jsoup.connect("https://tvtropes.org" + url).get();
            tropeList = basicGetTropes(tropeDoc);


            if (tropeList.size() == 0) {
                // no tropes? maybe in sub pages (i.e tropesAtoB)
                tropeList = subPagesGetTropes(tropeDoc, url);
            }


            while (tropeList.size() < gridSize * gridSize) {
                //if we're here, we've got a valid page but it ain't got enough tropes
                tropeList.add(new TropesEntity("FREE SPACE", "https://tvtropes.org" + url, "Not enough tropes listed on the page...¯\\_(ツ)_/¯", true));
            }
        } catch (IOException e) {
            //if we're here, we've probably not got a valid page
            while (tropeList.size() < gridSize * gridSize) {
                tropeList.add(new TropesEntity("FREE SPACE", "https://tvtropes.org" + url, "404, that page didn't exist!", true));
            }
        }
        ObjectMapper om = new ObjectMapper();
        Collections.shuffle(tropeList);
        return om.writeValueAsString(tropeList);
    }


    private ArrayList<TropesEntity> basicGetTropes(Document tropeDoc) {
        Elements aTagsInLi = tropeDoc.select("ul li a:eq(0).twikilink[title^=/pmwiki/pmwiki.php/Main/]");
        ArrayList<TropesEntity> tropes = new ArrayList<>();
        for (Element aTag : aTagsInLi) {
            assert aTag.parent() != null;
            if (aTag.parent().html().startsWith("<a")) {
                assert aTag.parent().parent() != null;
                if (aTag.parent().parent().html().startsWith("<li")) {
                    TropesEntity tE = new TropesEntity(aTag.html(), aTag.absUrl("href"), aTag.parent().text(), false);
                    tropes.add(tE);
                }
            }
        }
        return tropes;
    }

    private ArrayList<TropesEntity> subPagesGetTropes(Document tropeDoc, String url) throws IOException {
        ArrayList<TropesEntity> tropes = new ArrayList<>();

        String subUrl = url.substring(url.lastIndexOf("/") + 1);
        String[] split = url.split("/");
        String uri = "";
        for (int i = 0; i < split.length - 2; i++) {
            uri = uri.concat(split[i] + "/");
        }
        uri = uri.concat(subUrl);

        Elements subPages = tropeDoc.select("ul li a:eq(0).twikilink[title^=" + uri + "]");

        for (Element page : subPages) {
            Document pageDoc = Jsoup.connect("https://tvtropes.org" + page.attributes().get("href")).get();
            tropes.addAll(basicGetTropes(pageDoc));
        }
        return tropes;
    }

}
