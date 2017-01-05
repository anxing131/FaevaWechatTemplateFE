/**
 * Created by Administrator on 2016/12/7.
 */

interface Pagination{
    //总数
    total: number;

    // 当前页码
    index: number;

    //当前页数(既是每页展示的数量)
    limit: number;

    //获取数据
    fetch(url: string, cb, index?: number, limit ?: number): void;
}