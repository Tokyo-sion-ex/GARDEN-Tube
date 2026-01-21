import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import Home from './pages/Home.js';
import Watch from './pages/Watch.js';
import SearchResults from './pages/SearchResults.js';
import Trending from './pages/Trending.js';

export default class App {
    constructor() {
        this.currentPage = null;
        this.currentParams = {};
        
        // ルーティング
        this.routes = {
            '/': Home,
            '/watch/:id': Watch,
            '/search': SearchResults,
            '/trending': Trending
        };
        
        this.init();
    }
    
    async init() {
        this.renderLayout();
        this.setupRouter();
        this.loadPage();
    }
    
    renderLayout() {
        // クリアして再レンダリング
        document.body.innerHTML = '';
        
        // コンテナ
        const container = document.createElement('div');
        container.className = 'container';
        
        // ヘッダー
        const header = new Header();
        container.appendChild(header.render());
        
        // サイドバー
        const sidebar = new Sidebar();
        container.appendChild(sidebar.render());
        
        // メインコンテンツエリア
        const mainContent = document.createElement('main');
        mainContent.id = 'main-content';
        mainContent.className = 'main-content';
        container.appendChild(mainContent);
        
        document.body.appendChild(container);
    }
    
    setupRouter() {
        // ハッシュ変更イベント
        window.addEventListener('hashchange', () => {
            this.loadPage();
        });
        
        // 初期ロード
        window.addEventListener('load', () => {
            this.loadPage();
        });
    }
    
    loadPage() {
        const hash = window.location.hash.substring(1) || '/';
        const mainContent = document.getElementById('main-content');
        
        // ルートとパラメータを解析
        const { route, params } = this.parseRoute(hash);
        
        // 現在のページを保存
        this.currentRoute = route;
        this.currentParams = params;
        
        // ページコンポーネントをロード
        const PageComponent = this.routes[route];
        
        if (PageComponent) {
            // 前のページをクリア
            mainContent.innerHTML = '';
            
            // 新しいページをインスタンス化
            this.currentPage = new PageComponent(params);
            
            // ページをレンダリング
            mainContent.appendChild(this.currentPage.render());
            
            // ページの初期化メソッドを呼び出し（存在する場合）
            if (typeof this.currentPage.init === 'function') {
                this.currentPage.init();
            }
        } else {
            // 404ページ
            mainContent.innerHTML = `
                <div class="page-not-found">
                    <h1>404 - ページが見つかりません</h1>
                    <p>お探しのページは存在しないか、移動した可能性があります。</p>
                    <a href="#/" class="home-link">ホームに戻る</a>
                </div>
            `;
        }
    }
    
    parseRoute(hash) {
        // ルートを解析してパラメータを抽出
        for (const route in this.routes) {
            const routePattern = route.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${routePattern}$`);
            const match = hash.match(regex);
            
            if (match) {
                const params = {};
                const paramNames = [];
                const paramMatches = route.match(/:\w+/g);
                
                if (paramMatches) {
                    paramMatches.forEach((param, index) => {
                        const paramName = param.substring(1);
                        paramNames.push(paramName);
                        params[paramName] = match[index + 1];
                    });
                }
                
                return { route, params };
            }
        }
        
        return { route: hash, params: {} };
    }
}
