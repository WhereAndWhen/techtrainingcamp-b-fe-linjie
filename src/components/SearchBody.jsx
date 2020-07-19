import React from "react";

import "../styles/SearchBody.css"

import SearchBox from "./SearchBox"
import SearchResult from "./SearchResult"

//父组件
class SearchBody extends React.Component {
    //构造函数
    constructor(props){
        super(props);
        //初始化state
        this.state = {
            keyword: '',
            isShow: false,
            totalResults: [],
            searchResults: [],
            pageNum: 0,
            current: 1,
            hasResult: false
        };
        //
        this.handleSetKeyword = this.handleSetKeyword.bind(this);
        this.handleSetIsShow = this.handleSetIsShow.bind(this);
        this.handleSetSearchResults = this.handleSetSearchResults.bind(this);
        this.handleSetPageNum = this.handleSetPageNum.bind(this);
        this.handleSetTotalResults = this.handleSetTotalResults.bind(this);
        this.handleSetCurrent = this.handleSetCurrent.bind(this);
        this.handleSetHasResult = this.handleSetHasResult.bind(this);
    }

    //修改keyword 这个方法将被传递给子组件
    handleSetKeyword(keyword) {
        this.setState({
            keyword: keyword
        })
    }
    handleSetIsShow(isShow){
        this.setState({
            isShow: isShow
        })
    }
    handleSetSearchResults(searchResults){
        this.setState({
            searchResults: searchResults
        })
    }
    handleSetPageNum(pageNum){
        this.setState({
            pageNum: pageNum
        })
    }
    handleSetTotalResults(isClear, results){
        this.setState({
            totalResults: isClear ? [] : [...this.state.totalResults, results]
        })
    }
    handleSetCurrent(current){
        this.setState({
            current: current
        })
    }
    handleSetHasResult(hasResult){
        this.setState({
            hasResult: hasResult
        })
    }
    render() {
        return (
            <div className="search_body">
                <SearchBox 
                keyword={this.state.keyword} 
                setKeyword = {this.handleSetKeyword} 
                isShow = {this.state.isShow} 
                setIsShow = {this.handleSetIsShow}
                setSearchResults = {this.handleSetSearchResults}
                setPageNum = {this.handleSetPageNum}
                setTotalResults = {this.handleSetTotalResults}
                setCurrent = {this.handleSetCurrent}
                hasResult = {this.state.hasResult}
                setHasResult = {this.handleSetHasResult}
                />
                <SearchResult 
                keyword={this.state.keyword}
                searchResults = {this.state.searchResults}
                setSearchResults = {this.handleSetSearchResults}
                pageNum = {this.state.pageNum}
                totalResults = {this.state.totalResults}
                setTotalResults = {this.handleSetTotalResults}
                current = {this.state.current}
                setCurrent = {this.handleSetCurrent}
                hasResult = {this.state.hasResult}
                setHasResult = {this.handleSetHasResult}
                />
            </div>
        )
    }
}

export default SearchBody;