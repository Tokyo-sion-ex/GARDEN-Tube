import { formatViewCount, formatTimeAgo } from '../utils/helpers.js';

export default class VideoGrid {
    constructor(videos, title = '') {
        this.videos = videos;
        this.title = title;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'video-grid-container';
        
        if (this.title) {
            const titleElement = document.createElement('h2');
            titleElement.className = 'section-title';
            titleElement.textContent = this.title;
            container.appendChild(titleElement);
        }
        
        const grid = document.createElement('div');
        grid.className = 'video-grid';
        
        this.videos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
        
        container.appendChild(grid);
        return container;
    }
    
    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        
        // サムネイル
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';
        
        const thumbnail = document.createElement('img');
        thumbnail.src = video.thumbnail || 'https://placehold.co/320x180/333/666?text=No+Thumbnail';
        thumbnail.alt = video.title;
        thumbnail.className = 'thumbnail';
        
        if (video.duration) {
            const duration = document.createElement('span');
            duration.className = 'video-duration';
            duration.textContent = video.duration;
            thumbnailContainer.appendChild(duration);
        }
        
        thumbnailContainer.appendChild(thumbnail);
        
        // 動画情報
        const infoContainer = document.createElement('div');
        infoContainer.className = 'video-info';
        
        // チャンネルアイコン
        const channelIcon = document.createElement('img');
        channelIcon.src = video.uploaderAvatar || 'https://placehold.co/40/555/888?text=CH';
        channelIcon.alt = video.uploaderName;
        channelIcon.className = 'channel-icon';
        
        // 詳細情報
        const details = document.createElement('div');
        details.className = 'video-details';
        
        const title = document.createElement('h3');
        title.className = 'video-title';
        title.textContent = video.title;
        
        const channelName = document.createElement('p');
        channelName.className = 'channel-name';
        channelName.textContent = video.uploaderName;
        
        const metaInfo = document.createElement('p');
        metaInfo.className = 'video-meta';
        
        const viewCount = video.views ? `${formatViewCount(video.views)} 回視聴` : '';
        const uploadedDate = video.uploaded ? ` • ${formatTimeAgo(video.uploaded)}` : '';
        metaInfo.textContent = viewCount + uploadedDate;
        
        details.appendChild(title);
        details.appendChild(channelName);
        details.appendChild(metaInfo);
        
        infoContainer.appendChild(channelIcon);
        infoContainer.appendChild(details);
        
        card.appendChild(thumbnailContainer);
        card.appendChild(infoContainer);
        
        // クリックイベント
        card.addEventListener('click', () => {
            window.location.hash = `#/watch/${video.videoId}`;
        });
        
        return card;
    }
}
