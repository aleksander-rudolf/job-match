import { useState } from "react";
import "./tags-input.scss";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const TagsInput = (props) => {
	const [tags, setTags] = useState(props.tags);
	const removeTags = (indexToRemove) => {
		setTags([...tags.filter((_, index) => index !== indexToRemove)]);
	};

	/**
	 *
	 * @param event
	 */
	function addTags(event) {
		if (event.target.value !== "") {
			setTags([...tags, event.target.value]);
			event.target.value = "";
		}
	};

	/**
	 *
	 * @param id
	 * @param value
	 */
	const handleSubmit = (id, value) => {
    props.formData[id] = value;
  };

	return (
		<div className="input">
			<div className="tags-input">
				<ul id="tags">
					{tags.map((tag, index) => (
						<li key={index} className="tag">
							<span className="tag-title">{tag}</span>
							<span className="tag-close-icon" onClick={() => removeTags(index)}>
								&#10005;
							</span>
						</li>
					))}
				</ul>
				<input
					type="text"
					onKeyUp={(event) => (event.key === "Enter" ? addTags(event) : null)}
					placeholder={tags.length === 0 ? "Add keywords here" : null}
					onBlur={() => handleSubmit(props.name, tags)}
				/>
			</div>
		</div>
	);
};

export default TagsInput;
