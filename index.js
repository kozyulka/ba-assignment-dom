'use strict';

const postsContainer = document.getElementById('posts');
const tagsContainer = document.getElementById('tags');
const posts = [];
let visiblePostsNumber = 10;
let selectedTags = [];

// const filterPostsByTag = (visiblePosts) => {
//     return visiblePosts
//         .map((post) => {
//             let matchingTagsNumber = 0;

//             selectedTags.forEach((tag) => {
//                 if (post.tags.includes(tag)) {
//                     matchingTagsNumber++;
//                 }
//             });

//             return {
//                 ...post,
//                 matchingTagsNumber,
//             };
//         })
//         .sort((postOne, postTwo) => {
//             if (postOne.matchingTagsNumber > postTwo.matchingTagsNumber) return -1;
//             if (postOne.matchingTagsNumber < postTwo.matchingTagsNumber) return 1;
//             return 0;
//         });
// };

const filterPostsByTagAndDate = (visiblePosts) => {
    // let postsByMatchingTag = {
    //     '3': [],
    //     '2': [],
    //     '1': [],
    //     '0': [],
    // };

    // TODO:
    // 1. split
};

const showPosts = () => {
    let visiblePosts = posts;

    if (selectedTags.length > 0) {
        visiblePosts = filterPostsByTagAndDate(visiblePosts);
    }

    const html = visiblePosts
        .slice(0, visiblePostsNumber)
        .map((post) => {
            const tags = post.tags
                .map(tag => `<div class="tag">${tag}</div>`)
                .join('');
            const time = moment(post.createdAt).format("dddd, MMMM Do YYYY, h:mm a");

            return `
                <div class="post">
                    <button type="button" class="btn btn-danger">Delete</button>
                    <div class="post-title">${post.title}</div>
                    <div class="post-description">${post.description}</div>
                    <div class="post-image-container">
                        <img class="post-image" src="${post.image}"/>
                    </div>
                    <div class="post-upload">
                        <span class="post-upload-date">${time}</span>
                    </div>
                    <div class="post-tags-container">
                        ${tags}
                    </div>
                </div>
            `;
        })
        .join('');

    postsContainer.innerHTML = html;
};

const showTags = () => {
    const tags = [];
    let html = '';

    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
    });

    html = tags.map(tag => `<div id="${tag}" class="tag" onclick="selectTag('${tag}')">${tag}</div>`).join('');

    tagsContainer.innerHTML = html;
};

const onScroll = () => {
    const MIN_OFFSET = 300;
    const scrollBottom = document.documentElement.offsetHeight - (document.documentElement.clientHeight + document.documentElement.scrollTop);

    if (scrollBottom <= MIN_OFFSET) {
        visiblePostsNumber += 10;

        showPosts();
    }
};

const init = () => {
    fetch('https://api.myjson.com/bins/152f9j')
        .then(blob => blob.json())
        .then((data) => {
            posts.push(...data.data);
            showPosts();
            showTags();
        });

    document.addEventListener('scroll', onScroll);
};

init();

const selectTag = (tag) => {
    const element = document.getElementById(tag);

    if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(selectedTag => selectedTag !== tag);

        element.classList.remove('selected');
    } else {
        selectedTags.push(tag);
        element.classList.add('selected');
    }

    visiblePostsNumber = 10;

    showPosts();
};
