import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { routes } from '../../routes/routes'
import { profilePostsHandleGet, profilePostsHandleUpdate } from '../../store/posts/postsActions'
import { artistFollowersHandleGet, artistFollowedHandleGet} from '../../store/artistList/artistListActions'
import { userGetInfo } from '../../store/user/userActions'
import ListArtist from '../ui/listView/ListArtist'
import { ListView } from '../ui/listView/ListView'
import { LastPost } from '../ui/notifications/LastPost'
import { LoadingPost } from '../ui/notifications/LoadingPost'
import { Post } from '../ui/Post'
import ProfileInfo from '../ui/ProfileInfo'

const ProfileView = ({
    auth,
    user,
    userGetInfo,
    posts,
    artistFollowers,
    artistFollowed,
    profilePostsHandleGet,
    profilePostsHandleUpdate,
    artistFollowersHandleGet, 
    artistFollowedHandleGet
}) => {

    let { uid } = useParams();
    const history = useHistory();

    // Load Data
    useEffect(() => {
        if (uid !== user.user._id) {
            userGetInfo(uid, history);
            artistFollowersHandleGet(auth?.user?._id, history);
            artistFollowedHandleGet(auth?.user?._id, history);
        }

        if (posts.section !== `profile${uid}`)
            profilePostsHandleGet(uid, history);


    }, [uid]);

    // Waiting Errorss
    useEffect(() => {
        if (user.error !== null)
            toast.error(user.error);
        if (posts.error !== null)
            toast.error(posts.error);
    }, [user.error, posts.error]);

    return (
        <>
            <div className="main-center">
                <ProfileInfo uid={auth?.user?._id} />

                <InfiniteScroll
                    dataLength={posts.posts.length}
                    next={() =>
                        profilePostsHandleUpdate(
                            uid,
                            posts.posts[posts.posts.length - 1]?._id,
                            history
                        )}
                    hasMore={!posts.limit}
                    loader={<LoadingPost />}
                    scrollThreshold={1}
                    endMessage={<LastPost />}
                >
                    {posts.posts.map((post, index) => (<Post key={index} post={post} uid={auth?.user?._id} />))}
                </InfiniteScroll>
            </div>

            <footer className="footer">
                <div className="mb-2">

                    <ListView title={"Seguidores (" + artistFollowers?.artistFollowers.length + ")"  } icon="user" route={routes.artistFollowers}>
                         
                        {
                            (artistFollowers?.artistFollowers.length > 0) ?
                                (
                                    artistFollowers?.artistFollowers?.map(artist => (
                                        <ListArtist
                                            key={artist._id}
                                            id={artist._id}
                                        />
                                    ))
                                )
                                : (

                                    <div className="d-flex" style={{margin: '0.7rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div className="loading profile-image mr-1"></div>
                                        <div className="loading" style={{ flexGrow: '1', height: '1rem' }}></div>
                                    </div>
                                )
                        }
                    </ListView>
                </div>

                <div className="mb-2">
                    <ListView title={"Seguiendo (" + artistFollowed?.artistFollowed.length + ")"  } icon="user" route={routes.artistFollowed}>
                        {
                            (artistFollowed?.artistFollowed.length > 0) ?
                                (
                                    artistFollowed?.artistFollowed?.map(artist => (
                                        <ListArtist
                                            key={artist._id}
                                            id={artist._id}
                                        />
                                    ))
                                )
                                : (

                                    <div className="d-flex" style={{margin: '0.7rem 2rem', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div className="loading profile-image mr-1"></div>
                                        <div className="loading" style={{ flexGrow: '1', height: '1rem' }}></div>
                                    </div>
                                )
                        }
                    </ListView>
                </div>
            </footer>
        </>

    )
}

const data = (state) => ({
    user: state.userReducer,
    auth: state.authReducer,
    posts: state.postsReducer,
    artistFollowers: state.artistListReducer,
    artistFollowed: state.artistListReducer
});
const actions = {
    userGetInfo,
    profilePostsHandleGet,
    profilePostsHandleUpdate,
    artistFollowersHandleGet, 
    artistFollowedHandleGet
};
export default connect(data, actions)(ProfileView);