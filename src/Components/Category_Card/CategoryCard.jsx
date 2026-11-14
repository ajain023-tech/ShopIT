import React from 'react'
import styles from './Category.module.css'
import { Link } from 'react-router-dom'

const CategoryCard = ({ data }) => {
    return (
        <Link to={`/product/type/${data.type}`} className={styles.card}>
            <div className={styles.imgBox}>
                <img src={data.img} alt={data.name} className={styles.img} loading="lazy" />
            </div>
            <span className={styles.title}>{data.name}</span>
        </Link>
    )
}

export default CategoryCard
