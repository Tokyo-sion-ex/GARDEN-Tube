export default class VideoPlayer {
    constructor(videoData) {
        this.videoData = videoData;
        this.player = null;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'video-player-container';
        
        // 動画プレーヤー
        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-wrapper';
        
        if (this.videoData.videoStreams && this.videoData.videoStreams.length > 0) {
            // 最高画質の動画ストリームを選択
            const bestQuality = this.videoData.videoStreams
                .filter(stream => stream.quality.includes('1080') || stream.quality.includes('720'))
                .sort((a, b) => parseInt(b.quality) - parseInt(a.quality))[0] || this.videoData.videoStreams[0];
            
            const videoElement = document.createElement('video');
            videoElement.id = 'main-video-player';
            videoElement.className = 'video-player';
            videoElement.controls = true;
            videoElement.autoplay = true;
            
            const source = document.createElement('source');
            source.src = bestQuality.url;
            source.type = 'video/mp4';
            
            videoElement.appendChild(source);
            playerContainer.appendChild(videoElement);
            
            this.player = videoElement;
        } else {
            // ストリーム情報がない場合、代替プレーヤーを表示
            const placeholder = document.createElement('div');
            placeholder.className = 'video-placeholder';
            placeholder.innerHTML = `
                <div class="placeholder-content">
                    <i class="fas fa-video-slash"></i>
                    <p>動画を読み込めませんでした</p>
                    <a href="${this.videoData.videoUrl}" target="_blank" class="external-link">
                        <i class="fas fa-external-link-alt"></i> 元のサイトで視聴
                    </a>
                </div>
            `;
            playerContainer.appendChild(placeholder);
        }
        
        container.appendChild(playerContainer);
        
        // 動画情報
        const infoContainer = this.createVideoInfo();
        container.appendChild(infoContainer);
        
        return container;
    }
    
    createVideoInfo() {
        const container = document.createElement('div');
        container.className = 'video-info-container';
        
        // タイトル
        const title = document.createElement('h1');
        title.className = 'video-title';
        title.textContent = this.videoData.title;
        container.appendChild(title);
        
        // 動画統計とアクション
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'video-actions';
        
        // 視聴回数と投稿日
        const stats = document.createElement('div');
        stats.className = 'video-stats';
        
        const viewCount = this.videoData.views ? `${this.formatViewCount(this.videoData.views)} 回視聴` : '';
        const uploadDate = this.videoData.uploadDate ? ` • ${new Date(this.videoData.uploadDate * 1000).toLocaleDateString('ja-JP')}` : '';
        
        stats.textContent = viewCount + uploadDate;
        actionsContainer.appendChild(stats);
        
        // アクションボタン
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        
        const likeButton = this.createActionButton('いいね', 'fas fa-thumbs-up');
        const dislikeButton = this.createActionButton('よくない', 'fas fa-thumbs-down');
        const shareButton = this.createActionButton('共有', 'fas fa-share');
        const saveButton = this.createActionButton('保存', 'fas fa-plus-square');
        
        actionButtons.appendChild(likeButton);
        actionButtons.appendChild(dislikeButton);
        actionButtons.appendChild(shareButton);
        actionButtons.appendChild(saveButton);
        
        actionsContainer.appendChild(actionButtons);
        container.appendChild(actionsContainer);
        
        // チャンネル情報
        const channelContainer = document.createElement('div');
        channelContainer.className = 'channel-info';
        
        const channelAvatar = document.createElement('img');
        channelAvatar.src = this.videoData.uploaderAvatar || 'https://placehold.co/50/555/888?text=CH';
        channelAvatar.alt = this.videoData.uploader;
        channelAvatar.className = 'channel-avatar';
        
        const channelDetails = document.createElement('div');
        channelDetails.className = 'channel-details';
        
        const channelName = document.createElement('h3');
        channelName.textContent = this.videoData.uploader;
        
        const subscriberCount = document.createElement('p');
        subscriberCount.textContent = this.videoData.uploaderSubscriberCount ? 
            `${this.formatSubscriberCount(this.videoData.uploaderSubscriberCount)} 人登録` : '';
        
        channelDetails.appendChild(channelName);
        channelDetails.appendChild(subscriberCount);
        
        const subscribeButton = document.createElement('button');
        subscribeButton.className = 'subscribe-button';
        subscribeButton.innerHTML = '<i class="fas fa-bell"></i> 登録する';
        
        channelContainer.appendChild(channelAvatar);
        channelContainer.appendChild(channelDetails);
        channelContainer.appendChild(subscribeButton);
        
        container.appendChild(channelContainer);
        
        // 説明文
        if (this.videoData.description) {
            const description = document.createElement('div');
            description.className = 'video-description';
            description.textContent = this.videoData.description;
            container.appendChild(description);
        }
        
        return container;
    }
    
    createActionButton(text, iconClass) {
        const button = document.createElement('button');
        button.className = 'action-button';
        button.innerHTML = `<i class="${iconClass}"></i> ${text}`;
        return button;
    }
    
    formatViewCount(views) {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views.toString();
    }
    
    formatSubscriberCount(count) {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}百万人`;
        } else if (count >= 10000) {
            return `${(count / 10000).toFixed(1)}万人`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}千人`;
        }
        return count.toString();
    }
    
    play() {
        if (this.player) {
            this.player.play();
        }
    }
    
    pause() {
        if (this.player) {
            this.player.pause();
        }
    }
}
