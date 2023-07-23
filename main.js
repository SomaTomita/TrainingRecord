class TrainingRecord {
    //下記2のインスタンス(loadEntriesとupdateView)の繰り返しがなくなる。
    static LOCAL_STORAGE_DATA_KEY = "training-record-entries";

    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", TrainingRecord.html());
        this.entries = [];

        // 最初に呼び出し元を記載。
        this.loadEntries();
        this.updateView();

        // Add Entry+ ボタンをクリック時、下記コールバック関数を実行。
        this.root.querySelector(".record__add").addEventListener("click", () => {
            const date = new Date();
            // 現在の年を4桁の数字として取得しyear変数へ。
            const year = date.getFullYear();
            // getmonthメソッドに1をインクリメントして、1ベースの値に変換。
            // padStartメソッドで1桁の月であれば先頭の0が文字列になるように表現。 (日も同様。)
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");

            this.addEntry({
                date: `${ year }-${ month }-${ day }`,
                workout:'',
                times : 5,
                set : 5,
                weight : 10,
                duration: 30
            });
        });
    }

    // TrainingRecordクラスのインスタンスを作成することなく、クラス上で直接アクセス。
    static html() {
        return `
            <table class="record">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Workout</th>
                        <th>Times</th>
                        <th>Set</th>
                        <th>weight</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="record__entries"></tbody>
                <tbody>
                    <tr class="record__row record__row--add">
                        <td colspan="6">
                            <span class="record__add">Add Entry &plus;</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    static rowHtml() {
        return `
            <tr class="record__row">
                <td>
                    <input type="date" class="record__date">
                </td>
                <td>
                    <input class="record__workout txt__limit" type="text" placeholder="enter training type">
                </td>
                <td>
                    <input type="number" class="record__times">
                    <span class="record__text__times">times</span>
                </td>
                <td>
                    <input type="number" class="record__set">
                    <span class="record__text__set">set</span>
                </td>
                <td>
                    <input type="number" class="record__weight">
                    <span class="record__text__kg">kg</span>
                </td>
                <td>
                    <input type="number" class="record__duration">
                    <span class="record__text__minutes">minutes</span>
                </td>
                <td>
                    <button type="button" class="record__button record__delete">&times;</button>
                </td>
            </tr>
        `;
    }

    // ブラウザのlocalStorageからthis.entries プロパティにデータを設定。
    // || "[]" は論理和演算子で、localStorageから取得した値がNULLまたは未定義の場合、空の配列[]がデフォルト値として使用される。
    loadEntries() {
        this.entries = JSON.parse(localStorage.getItem(TrainingRecord.LOCAL_STORAGE_DATA_KEY) || "[]");
    }

    // stringifyでJSONデータ化し、localStorageへ配列を保存。
    saveEntries() {
        localStorage.setItem(TrainingRecord.LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.entries));
    }

    // this.entries 配列のデータをもとに、表の追加、削除、データの変更が反映され、最新の情報が表示。
    updateView() {
        // this.root要素内からrecord__entriesを取得(date、workout等が書かれた表とaddentryの間のテーブル本体の要素)し、tableBodyへ代入。
        const tableBody = this.root.querySelector(".record__entries");
        // dataを引数として受けとるaddRow関数の定義。(新しい行をテーブルに追加)
        const addRow = data => {
            // TrainingRecord.rowHtml().trim() を使用して、行のtemplateを文字列として取得し、それを <template> 要素の中に挿入。
            // templateは静的な HTML の断片を保持し、それをコピーして必要な数の行を追加するために複数回使用される。
            const template = document.createElement("template");
            //  template.content.firstElementChild を介して新しい行要素rowHtml()を一時的に保持するための変数を用意。
            // <template> 要素内のコンテンツを表す DOM ツリーのフラグメントで直接操作できないため、一時的な変数を使うことで、後続の操作において、テンプレート内の特定の要素にアクセス可能に。
            let row = null;
            
            // templateにrowHtmlを追加。
            template.innerHTML = TrainingRecord.rowHtml().trim();
            // template内の最初の子要素である新しい行の要素(rowHtml()の<tr>)を取得。
            row = template.content.firstElementChild;


            // それぞれの入力要素をinputからの値をdata.~~に設定。
            row.querySelector(".record__date").value = data.date;
            row.querySelector(".record__workout").value = data.workout;
            row.querySelector(".record__times").value = data.times;
            row.querySelector(".record__set").value = data.set;
            row.querySelector(".record__weight").value = data.weight;
            row.querySelector(".record__duration").value = data.duration;

            // 変更されれば値を更新し、this.entriesのlocalStorageへ随時保存。
            row.querySelector(".record__date").addEventListener("change", ({ target }) => {
                // target はイベントが発生した要素そのものを参照しており、 .value を使ってその要素の現在の値を取得している。
                data.date = target.value;
                this.saveEntries();
            });

            row.querySelector(".record__workout").addEventListener("change", ({ target }) => {
                data.workout = target.value;
                this.saveEntries();
            });

            row.querySelector(".record__times").addEventListener("change", ({ target }) => {
                data.times = target.value;
                this.saveEntries();
            });

            row.querySelector(".record__set").addEventListener("change", ({ target }) => {
                data.set = target.value;
                this.saveEntries();
            });
            
            row.querySelector(".record__weight").addEventListener("change", ({ target }) => {
                data.weight = target.value;
                this.saveEntries();
            });

            row.querySelector(".record__duration").addEventListener("change", ({ target }) => {
                data.duration = target.value;
                this.saveEntries();
            });


            // 特定の行に対して削除ボタンがクリックされた際、その行に関連するデータを削除するメソッドを呼ぶ。
            row.querySelector(".record__delete").addEventListener("click", () => {
                this.deleteEntry(data);
            });

            // 関数addRow内で定義された変数rowに格納された新しい行要素(rowHtmlの行)をtableBodyの子要素として追加。
            tableBody.appendChild(row);
        };

        // 表内の既存(既にEntry add+で追加された)行を、行要素ごとにすべて削除。
        tableBody.querySelectorAll(".record__row").forEach(row => {
            row.remove();
        });

        // this.entries 配列内の各要素をループして、それぞれの要素に対してaddRow関数を呼び出し、配列各要素を表に追加。
        this.entries.forEach(data => addRow(data));
    }

    addEntry(data) {
        // pushを使って配列に要素を追加。
        this.entries.push(data);
        this.saveEntries();
        this.updateView();
    }

    // 削除するデータ以外はリストに保持。
    deleteEntry(dataToDelete) {
        // dataToDelete(削除するdata)と等しくない要素をフィルタリング。
        this.entries = this.entries.filter(data => data !== dataToDelete);
        this.saveEntries();
        this.updateView();
    }
}


const app = document.getElementById("app");
// コンストラクタの引数として app 要素を渡し、TrainingRecordクラスの新しいインスタンスを作成。
const wt = new TrainingRecord(app);
// wtインスタンスはグローバルにアクセスできるようになる。
window.wt = wt;