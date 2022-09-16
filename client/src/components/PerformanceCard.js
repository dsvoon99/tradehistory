export const PerformanceCard = (props) => {

    const { key, value } = props;

    return (
        <div className="performance-card d-flex twrr-card">
            <div>
                <p>
                    { key }
                </p>
                <p>
                    { value  }
                </p>
            </div>
            <div>
                <span class="material-icons">chevron_right</span>
            </div>
        </div>
    )
}