import React from "react"
import axios from "axios"
import "../styles/SearchResult.css"
import {Pagination} from 'react-bootstrap'
import '../lib/iconfonts/iconfont.css'

class SearchResult extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pageSize: 10,  //每页显示的条数
            offset: 0,
            count: -1,
            results : {}  
        };
        this.noResult = React.createRef();
    }
    componentWillReceiveProps() {
        if(this.props){
            this.setState({
                results: this.props.searchResults
            })
            let count = 0;
            if(this.props.searchResults) {
                count = this.props.searchResults.length
            }
            this.setState({
                count: count
            })
        }else{
            this.setState({
                count: 0
            })
        }
    }
    onNext = (e) => {
        
        console.log(this.props.pageNum);
        if(this.props.current < this.props.pageNum){
            //请求下一页数据
            const offset = (this.props.current)*this.state.pageSize;
            const current = this.props.current+1;
            //this.setState 异步方法！
            this.setState({
                offset: offset,
            })
            this.props.setCurrent(current);
            let uri = encodeURI("http://localhost:8000/search/?keyword=" + encodeURI(this.props.keyword) + "&offset=" + offset);
            //const 
            axios.get(uri)
                .then((res) => {
                    console.log(res);
                    this.props.setSearchResults(res.data.data);
                    this.props.setTotalResults(false, res.data.data);
                    this.props.setHasResult(true);
                })
                .catch((err) => {
                    console.log(err);
                })
        }else{
            //已到最后一页，禁用下一页按钮
        }
    }
    onPre = (e) =>{
        if(this.props.current > 1){
            console.log(this.props.totalResults);
            console.log(this.props.current);
            const current = this.props.current;
            const results = this.props.totalResults;
            const index = this.props.current-2;
            //console.log(this.state.current);
            this.props.setSearchResults(results[index]);
            this.props.setCurrent(current-1);
        }else{
            //已是首页，禁用上一页按钮
        }
    }
    componentDidMount(){
        this.noResult.current.className = "no_result_hidden";
    }
    render(){
        //const results = this.props.searchResults[this.state.current-1] || [];
        if (this.state.count>0&&this.props.searchResults) {
            return (
                <div className="search_result">
                    <div className="result_box">
                        
                        {this.props.searchResults.map((item, key) => {
                            const {title, link_url, user_name, create_time, tags, description, comments_count} = item;
                            //转换时间
                            const localTime = new Date(create_time + 8*3600*1000).toJSON().substr(0, 19).replace('T', ' ');
                            return <div className="result_list" key={key}>
                                {/*JSON.stringify(item)*/}
                                    {/*eslint-disable-next-line*/}
                                    <div className="title"><a href={link_url} target="_blank">{title}</a></div>
                                    <div className="info">
                                        <span><i className="iconfont iconauthor"></i><span className="text">{user_name}</span></span>
                                        <span><i className="iconfont icontime"></i><span className="text">{localTime}</span></span>
                                    </div>
                                    <div className="desc">{description || '...'}</div>
                                    <div className="comments_tags">
                                        <span className="comments"><i className="iconfont iconcomment"></i><span className="text">{comments_count}</span></span>
                                        <span className="tags">
                                        {tags.map((item, key) => {
                                            return <span key={key}><i className="iconfont icontag"></i><span className="text">{item}</span></span>
                                        })}
                                        </span>
                                        </div>
                                </div>
                        })}
                        <div className="change_page">
                            {/* <div>
                                <span onClick={this.onPre}><i className="iconfont iconleft"></i></span>
                                <span>{this.props.current}/{this.props.pageNum}页</span>
                                <span onClick={this.onNext}><i className="iconfont iconleft-copy"></i></span>
                            </div> */}
                            <Pagination>
                                <Pagination.Item onClick={this.onPre}>{"<"}</Pagination.Item>
                                <Pagination.Item disabled className="page">{this.props.current}/{this.props.pageNum}页</Pagination.Item>
                                <Pagination.Item onClick={this.onNext}>{">"}</Pagination.Item>
                            </Pagination>
                        </div>
                    </div>
                </div>   
            )
        }else {
            return (
                <div ref={this.noResult} className={this.props.hasResult ? "no_result_hidden" : "no_result"}></div>
            )
        }
        
    }
}

export default SearchResult;