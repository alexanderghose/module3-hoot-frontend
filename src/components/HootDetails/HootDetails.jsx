import { useState, useEffect } from 'react';
import * as hootService from '../../services/hootService';
import { useParams } from "react-router-dom";
import CommentForm from '../CommentForm/CommentForm';

const HootDetails = (props) => {
  const [hoot, setHoot] = useState(null);

  // this needs to get passed down so teh button
  // can update parent state here
  const handleAddComment = async (commentFormData) => {
    // when the comment is created in the db, the
    // backend returns the newly created comment
    const newComment = await hootService.createComment(hootId, commentFormData);
    // i want to update the "hoot" state to be:
    //   ... a clone of the existing hoot plus a comments property
    //  and in hte comments property i want
    // .... a clone of the existing hoot.comments plus the new comment
    setHoot({ ...hoot, comments: [newComment, ...hoot.comments] });

  };

  // destructuring syntax
  // equivalent to= const hootId = useParams().hootId
  const { hootId } = useParams()

  useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      console.log('hootData', hootData);
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);
  
  // Verify that hoot state is being set correctly:
  console.log('hoot state:', hoot);

  if (!hoot) return <main>Loading...</main>;

  return (
    <main>
      <header>
        <p>{hoot.category.toUpperCase()}</p>
        <h1>{hoot.title}</h1>
        <p>
          {hoot.author.username} posted on
          {new Date(hoot.createdAt).toLocaleDateString()}
        </p>
      </header>
      <p>{hoot.text}</p>
      <section>
  <h2>Comments</h2>
  <CommentForm handleAddComment={handleAddComment} />

  {!hoot.comments.length && <p>There are no comments.</p>}

  {hoot.comments.map((comment) => (
    <article key={comment._id}>
      <header>
        <p>
          {comment.author.username} posted on
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </header>
      <p>{comment.text}</p>
    </article>
  ))}
</section>
    </main>
  );
};
  
export default HootDetails;