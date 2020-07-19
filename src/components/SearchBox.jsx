import React from 'react'
import axios from 'axios'

import "../styles/SearchBox.css"
import 'bootstrap/dist/css/bootstrap.min.css'

class SearchBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            sugWords: [],
            index: -1,
            listData: [],
            isSelect: false
        };
        this.searchInput = React.createRef();
    }
    handleInputChange = async (e) => {
        //console.log(this.searchInput.current.value);
        const keyword = e.target.value;
        //const keyword = this.searchInput.current.value;
        //调用父组件方法更新父组件state的值
        this.props.setKeyword(keyword);
        //console.log(this.props);
        //console.log(this.props.keyword);
        //console.log(keyword);
        //keyword不为空时发送请求
        if(keyword){
            this.sendSugRequest(keyword, true);
        }else{
            this.props.setIsShow(false);
        }
        
    }

    handleInputBlur = (e) => {
        //console.log(e.target);
        //延时执行onBlur事件，以触发li的点击事件
        setTimeout(() => {
            this.props.setIsShow(false);
        },100)
    }
    handleInputFocus = (e) => {
        //console.log('focus');
        if(this.state.sugWords.length){
            this.props.setIsShow(true);
        }
    }
    handleBtnClick = (e) => {
        //console.log(e.target);
        //console.log("keyword=",this.props.keyword.trim());
        //console.log('focus')
        //this.props.setIsShow(false);
        //this.searchInput.current.focus();
        const keyword = this.props.keyword.trim();
        this.sendSearchRequest(keyword);
    }
    handleSugClick = (e) => {
        //console.log(e.target.innerHTML);
        const keyword = e.target.innerHTML.trim();
        this.props.setKeyword(keyword);
        //console.log(this.searchInput.current);
        //input值改变后请求对应的推荐搜索词
        this.sendSugRequest(keyword, false);
        //上面改变keyword值后这里不会输出的keyword仍为改变之前的
        //console.log(this.props.keyword);
        this.sendSearchRequest(keyword);
    }
    handleKeyDown = (e) =>{
        //Enter发送请求
        const keyword = e.target.value.trim();
        if(e.keyCode === 13){
            //console.log("Enter");
            this.sendSearchRequest(keyword);
        }
    }
    handleKeyUp = (e) => {
        //键盘上下键选择推荐词列表里的推荐词
        const keyCode = e.keyCode;
        const sugWords = this.state.sugWords;
        const keyword = e.target.value;
        if(sugWords.length){      
            let stateIndex = this.state.index;
            let currIndex = stateIndex;
            //console.log(stateIndex);
            if(stateIndex < 0){
                let listData = sugWords.map((item, key) => {
                    return item.keyword;
                })
                listData = [keyword, ...listData];
                this.setState({
                    listData: listData
                })
            }
            
            if(keyCode === 38 || keyCode === 40){
                if(keyCode === 38){
                    if(stateIndex <= 0){
                        currIndex = this.state.listData.length-1;
                    }else{
                        currIndex--;
                    }
                }else{
                    //console.log(this.state.listData);
                    if(stateIndex >= this.state.listData.length-1){
                        currIndex = 0;
                    }else if(stateIndex < 0){
                        currIndex = currIndex + 2;
                    }else{
                        currIndex++;
                    }
                }
                this.setState({
                    index: currIndex
                })
                this.props.setKeyword(this.state.listData[currIndex]);
            }
        }
    }
    sendSugRequest = async (keyword, isChange) => {
        let uri = encodeURI("http://localhost:8000/sug/?keyword=" + encodeURI(keyword));
        const sugResults = await (await axios.get(uri)).data.data;
        //console.log(keyword);
        //console.log(sugResults);
        if(sugResults.length){
            this.setState({
                sugWords: sugResults,
            })
            //判断是handleInputChange发来的请求还是handleSugClick发来的请求
            if(isChange){
                this.props.setIsShow(true);
            }else{
                this.props.setIsShow(false);
            }
        }else{
            this.setState({
                sugWords: sugResults,
            })
            this.props.setIsShow(false);
        }
    }
    sendSearchRequest = async (keyword)=>{
        let uri = encodeURI("http://localhost:8000/search/?keyword=" + encodeURI(keyword));
        //console.log(uri);
        const searchResults = await (await axios.get(uri)).data;
        this.props.setSearchResults(searchResults.data);
        //console.log(searchResults)
        this.props.setPageNum(Math.ceil(searchResults.total/10));
        this.props.setCurrent(1);
        if(searchResults.data && searchResults.data.length > 0){
            //首页显示搜索结果时先请空之前的totalResults
            this.props.setTotalResults(true, []);
            this.props.setTotalResults(false, searchResults.data);
            this.props.setIsShow(false);
            this.props.setHasResult(true);
        }else{
            this.props.setHasResult(false);
        }
    }
    //生命周期函数 组件加载完毕时input获得焦点
    componentDidMount(){
        this.searchInput.current.focus();
    }
    render() {
        return (
            <div className="search_box">
                <div  className="search_bar">
                    <input className={this.props.isShow ? "search_input add_list" : "search_input"} ref={this.searchInput} type="text" placeholder="头条搜索" autoComplete="off" 
                    value={this.props.keyword} 
                    onChange={this.handleInputChange} 
                    onBlur={this.handleInputBlur} 
                    onFocus={this.handleInputFocus} 
                    onKeyDown={this.handleKeyDown}
                    onKeyUp={this.handleKeyUp}/>
                    <input className="search_btn" value="搜索" type="submit" onClick={this.handleBtnClick}/>
                </div>
                <div className="sug_list">
                    <ul className={this.props.isShow ? "search_list" : "search_list_hidden"}>  
                        {this.state.sugWords.map((item, key) => {
                            return <li key={key} onClick={this.handleSugClick}>{item.keyword}</li>
                        })}               
                    </ul>
                </div>
            </div>
        )
    }
}

export default SearchBox;