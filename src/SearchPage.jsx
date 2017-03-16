import * as React from "react";
import * as _ from "lodash";

import {
    SearchkitManager, SearchkitProvider,
    SearchBox, RefinementListFilter, MenuFilter, RangeFilter,
    Hits, HitsStats, NoHits, Pagination, SortingSelector,
    SelectedFilters, ResetFilters, ItemHistogramList,
    Layout, LayoutBody, LayoutResults, TopBar, ItemCheckboxList, TagCloud,
    SideBar, ActionBar, ActionBarRow, InputFilter, PageSizeSelector, Toggle,
    Tabs, ItemList, CheckboxItemList, DynamicRangeFilter, ViewSwitcherToggle, ViewSwitcherHits
} from "searchkit";

require("./index.scss");

// const host = "http://data.iterativ.ch:9200/albums";
//const host = "http://localhost:9200/albums";
const host = "https://search-iterativ-3tne266mehlnpx4374mxttxonm.eu-central-1.es.amazonaws.com/albums";
const searchkit = new SearchkitManager(host);

const AlbumHitsGridItem = (props)=> {
  const {bemBlocks, result} = props;

  if (result) {
    const source = _.extend({}, result._source, result.highlight);
    let url = "https://musicbrainz.org/release/" + source.gid;

    console.log(source);

    return (
      <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
        <a href={url} target="_blank">
          <img data-qa="poster" className={bemBlocks.item("poster")} src={source.cover_image} width="170" height="170"/>
          <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.album_title}}></div>
          <div data-qa="title" className={bemBlocks.item("title")} dangerouslySetInnerHTML={{__html:source.album_artist}}></div>
        </a>
      </div>
    )
  }
};

export const AlbumHitsListItem = (props)=> {
  const {bemBlocks, result} = props;

  if (result) {
    const source = _.extend({}, result._source, result.highlight);
    let url = "https://www.imdb.com/title/" + result._source.imdbId;

    console.log('JLHGLKJHLAKDJFHLKAJH');
    console.log(source);

    return (
        <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
          <div className={bemBlocks.item("poster")}>
              <img data-qa="poster" src={source.cover_image} width="170" height="170"/>
          </div>
          <div className={bemBlocks.item("details")}>
              <h3 className={bemBlocks.item("subtitle")}>{source.album_title}</h3>
              <div className={bemBlocks.item("text")}>Artist: {source.album_artist}</div>
              <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.tracks[0].lyrics}}></div>
          </div>
      </div>
    )
  }
};

export class SearchPage extends React.Component {
	render(){
		return (
			<SearchkitProvider searchkit={searchkit}>
		    <Layout>
		      <TopBar>
		        <SearchBox
		          autofocus={true}
		          searchOnChange={true}
							placeholder="Search albums..."
		          prefixQueryFields={["album_title", "tracks.lyrics"]}/>
		      </TopBar>
		      <LayoutBody>
		        <SideBar>
              <RangeFilter
                  id="album_release_year"
                  field="album_release_year"
                  min={1960}
                  max={2016}
                  showHistogram={true}
                  title="Release"/>
              <RangeFilter
                  id="track_count"
                  field="track_count"
                  min={0}
                  max={30}
                  showHistogram={true}
                  title="Track Count"/>
							<MenuFilter
								id="name"
								title="Artist Name"
								field="main_artist.name.raw"
								listComponent={ItemHistogramList}
                size={10}/>
              <RefinementListFilter
                id="lyrics"
                title="Lyrics"
                field="tracks.lyrics"
                operator="AND"
                listComponent={TagCloud}
                size={25}/>
							<MenuFilter
								id="type"
								title="Packaging"
								field="packaging.raw"
								listComponent={ItemHistogramList}
                size={10}/>
		        </SideBar>
		        <LayoutResults>
		          <ActionBar>
		            <ActionBarRow>
		              <HitsStats/>
                  <ViewSwitcherToggle/>
									<SortingSelector options={[
										{label:"Relevance", field:"_score", order:"desc", defaultOption:true},
										{label:"Latest Releases", field:"released", order:"desc"},
										{label:"Earliest Releases", field:"released", order:"asc"}
									]}/>
		            </ActionBarRow>
		            <ActionBarRow>
		              <SelectedFilters/>
		              <ResetFilters/>
		            </ActionBarRow>
		          </ActionBar>
              <ViewSwitcherHits
                  hitsPerPage={50} highlightFields={["album_title","album_artist"]}
                  hitComponents={[
                      {key:"grid", title:"Grid", itemComponent:AlbumHitsGridItem, defaultOption:true},
                      {key:"list", title:"List", itemComponent:AlbumHitsListItem}
                  ]}
                  scrollTo="body" />
		          <NoHits/>
							<Pagination showNumbers={true}/>
		        </LayoutResults>
		      </LayoutBody>
		    </Layout>
		  </SearchkitProvider>
		)
	}
}
