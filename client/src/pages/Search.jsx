import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Button, Select, TextInput } from 'flowbite-react';
import { useNavigate } from'react-router-dom';
import PostCard from '../components/PostCard'

export default function Search() {

    const [sidebarData , setSidebarData] = useState({
        searchTerm : '',
        sort : 'desc',
        category : 'uncategortized',
    });

    
    const [posts , setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

        const navigate = useNavigate();
        const location = useLocation();

    // console.log(sidebarData);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
            setSidebarData({
                ...sidebarData,
                searchTerm : searchTermFromUrl,
                sort : sortFromUrl,
                category : categoryFromUrl,
            });
        }


        // Fetching the posts as per the parameters
        const fetchPosts = async() => {
            try{
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/post/getposts?${searchQuery}`);

                if(!res.ok){
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    const data = await res.json();
                    setPosts(data.posts);
                    setLoading(false);

                    if(data.posts.length === 9){
                        setShowMore(true);
                    }else{
                        setShowMore(false);
                    }
                }

            }
            catch(err){
                console.log(err);
            }
        }
        fetchPosts();
    }, [location.search]);



    // This handle change function is called when there is a change in the sidebar 
    // data values updated by the help of the form below
    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({
             ...sidebarData,
                searchTerm : e.target.value,
            });
        }
        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc';
            setSidebarData({
             ...sidebarData,
                sort : order,
            });
        }

        if(e.target.id === 'category'){
            setSidebarData({
           ...sidebarData,
                category : e.target.value,
            });
        }
    }

// Submit Handler or the form that is used to take the query choices for the search of the posts
    const handleSubmit =(e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        // console.log(searchQuery);0
        navigate(`/search?${searchQuery}`);
    }

    // This is used to handle whether the show more button for the posts
    // will be displayed or not.
    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/post/getposts?${searchQuery}`);

        if(!res.ok){
            return;
        }
        if(res.ok){
            const data = await res.json();
            setPosts([...posts , ...data.posts]);
            if(data.posts.length === 9){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
        }
    }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
            
            {/* For the search Term */}
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <TextInput placeholder='Search...' id='searchTerm' type='text'
                    value = {sidebarData.searchTerm}
                    onChange={handleChange}/>
            </div>

             {/* For the Sorting order */}
            <div className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label>
                <Select onChange={handleChange} value={sidebarData.sort} id = 'sort'>
                    <option value = 'desc'>Latest</option>
                    <option value = 'asc'>Oldest</option>
                </Select>
            </div>

            {/* For the Category */}
            <div className='flex items-center gap-2'>
                <label className='font-semibold'>Category:</label>
                <Select onChange={handleChange} value={sidebarData.category} id = 'category'>
                    <option value = 'uncategorized'>Uncategorized</option>
                    <option value = 'reactjs'>React.js</option>
                    <option value = 'nextjs'>Next.js</option>
                    <option value = 'javascript'>JavaScript</option>
                </Select>
            </div>

            {/* For the Submit Button */}
            <Button type = 'submit' outline gradientDuoTone='purpleToPink'>
                Apply Filters
            </Button>
        </form>
      </div>

      {/* To display the results of the post */}
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results</h1>
        <div className='p-7 flex flex-wrap gap-4'>
            {
                !loading && posts.length === 0 && (<p className='text-xl text-gray-500'>
                    No posts found.
                </p>)
            }

            {
                loading && <p className='text-xl text-gray-500'>Loading...</p>
            }

            {
                !loading && posts && posts.map((post) => (
                    <PostCard key = {post._id} post = {post} />
                ))
            }
            {
                showMore && (<button className='text-teal-500 text-lg hover:underline
                p-7 w-full' onClick={handleShowMore}>Show More</button>)
            }
            
        </div>
      </div>
    </div>
  )
}
