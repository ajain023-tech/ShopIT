import React from 'react'
import styles from './Category.module.css'
import { Link } from 'react-router-dom'

const CategoryCard = ({ data }) => {
    return (
        <Link to={`product/type/${data.name.toLowerCase()}`}>
            <div className={styles.mainCard}>
                <img src={data.img} alt={`${data.name} category`} className={styles.mainImg} loading="eager" />
                <span className={styles.imgTitle}>{data.name}</span>
            </div>
        </Link>
    )
}

export default CategoryCard
