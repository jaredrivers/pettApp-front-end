import GalleryItem from "../components/GalleryItem";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getallPets } from "../actions/petActions";
import AdvancedSearch from "../components/AdvancedSearch";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import { loadProfile } from "../actions/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

function Gallery() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.loading);
	const dbPets = useSelector((state) => state.pet.petData);
	const results = useSelector((state) => state.search.petData);
	const favorites = useSelector((state) => state.favorites.favorites);
	const user = useSelector((state) => state.user);

	const [searchParams] = useSearchParams();
	const [passSearch, setPassSearch] = useState();
	const [petsToDisplay, setPetsToDisplay] = useState();

	const override = css`
		display: block;
		margin: 0 auto;
	`;

	useEffect(() => {
		dispatch(getallPets());
		if (searchParams) {
			setPassSearch(searchParams.get("q"));
		}
	}, []);

	useEffect(() => {
		if (user.currentUser !== null && Object.keys(user).length !== 0) {
			dispatch(loadProfile(user.currentUser.id));
		}
	}, [user]);

	useEffect(() => {
		if (dbPets && dbPets.length !== 0) {
			let toDisplay = dbPets.filter((pet) => pet.adoptionStatus !== "Adopted");
			toDisplay = toDisplay.reverse();
			setPetsToDisplay(toDisplay);
		}
	}, [dbPets]);

	return loading ? (
		<div className=' flex w-full h-full justify-center items-center bg-[url(./imgs/home1.jpg)] bg-cover'>
			<HashLoader loading={loading} css={override} size={100} color='#5a7bb0' />
		</div>
	) : (
		<div className='flex flex-col overflow-x-scroll h-full pt-[4rem] bg-[url(./imgs/home1.jpg)] bg-cover w-full'>
			<AdvancedSearch search={passSearch} />
			<ul className='flex flex-col sm:grid sm:grid-cols-2 xmd:grid-cols-3 xl:grid-cols-4 w-full py-3 px-5 items-center overflow-y-scroll '>
				{results ? (
					results.map((pet) => (
						<li key={pet._id} className=''>
							<GalleryItem
								name={pet.name}
								type={pet.type}
								bio={pet.bio}
								color={pet.color}
								tags={pet.tags}
								breed={pet.breed}
								hypoallergnic={pet.hypoallergnic}
								adoptionStatus={pet.adoptionStatus}
								id={pet._id}
								height={pet.height}
								weight={pet.weight}
								url={pet.url}
							/>
						</li>
					))
				) : (
					<>
						{petsToDisplay &&
							petsToDisplay.map((pet) => (
								<li key={pet._id} className=''>
									<GalleryItem
										name={pet.name}
										type={pet.type}
										bio={pet.bio}
										color={pet.color}
										tags={pet.tags}
										breed={pet.breed}
										hypoallergnic={pet.hypoallergnic}
										adoptionStatus={pet.adoptionStatus}
										id={pet._id}
										height={pet.height}
										weight={pet.weight}
										picture={pet.picture}
										likedPets={favorites}
										url={pet.url}
									/>
								</li>
							))}
					</>
				)}
			</ul>
		</div>
	);
}

export default Gallery;
