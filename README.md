# TrainingRecord
![trainingrecord_home](https://github.com/SomaTomita/TrainingRecord/assets/134721775/4e206f6a-31f9-4523-9289-024c921e9a29)
# Add Entry
![trainingrecord_addentry](https://github.com/SomaTomita/TrainingRecord/assets/134721775/3164e21f-bde0-431c-8abe-6a969ea28842)
# Record
![trainingrecord_record](https://github.com/SomaTomita/TrainingRecord/assets/134721775/011ba57f-6114-4256-a946-41823f4768c5)



# Training Record
 - 筋トレメニューの記録サイトです。
 - 種目、回数、セット数、重量、時間を記録できます。
 - twitterで共有し、努力の証を残せます。

## 目指した課題解決
- 手軽なメニュー記録によるトレーニング時間の最適化、強度の向上。
  ### ペルソナ
- 趣味で、既に継続的にジムに通い、筋トレをしている人。 (趣味の域をもうすぐ超えようとしている人。)
- 時間単位である程度やることは決まっているが、日々のトレーニングのメニューにむら(ばらつき)がある人。
- わざわざアプリを入れてトレーニングの履歴を残すことさえめんどくさいと思っているが、数週間前のメニューを手軽に確認したい人。

### フロントエンド
- HTML/CSS
- Javascript

## 改良予定
- CSSの修正。
- レスポンシブデザイン対応。
- カレンダー上での振り返り機能追加。

### エラー例と解決方法
- loadEntriesメソッドでthis.entriesが未定義のままでデータの取得に失敗した。    
空配列を用意していなかったため、saveEntriesメソッドが呼ばれた時にローカルストレージには新しいデータが保存されなかった。論理演算によりデフォルトの空配列を設定することで、初期化したことで、正常に動作した。
- templateをそのままinputフォームの更新に使用したためにエラーが出た。     
template.content は <template> 要素内のコンテンツを表す DOM ツリーのフラグメントで、これは直接操作できず、そのままでは参照や操作ができない。そのため、template.content から新しい行の要素(rowHtml()の<tr>)を取得し、一時的に変数(row)へ格納。一時的に変数としてrowを使うことで、後続の操作や参照において、template内の特定の要素にアクセスできるようにした。
- .querySelectorAllで行要素全てを削除できなかった。    
最初はそれぞれの行要素を取得できていなかったため、既存の行は削除されずに残ってしまい、新しい行が追加されるたびに古い行と重複して表示された。.forEachで取得したすべての行要素に対して削除操作を行なったことで適切に作動した。

### 工夫した点
- データの追加・削除・更新のリアルタイムな反映    
updateView メソッド内で、this.entries の変更に応じて表の内容を動的に更新され、データの変更が発生した際はupdateView メソッドが呼び出され表内の行が新しいデータの追加や削除が行えます。これにより、ユーザーが操作したデータの変更が即座に表示されるため、使いやすくインタラクティブなUIを実現しています。

- ローカルストレージの活用    
データの永続性を確保するために、localStorage を使用してデータをブラウザのローカルストレージに保存しています。loadEntries メソッドでデータを読み込み、saveEntries メソッドでデータを保存しています。これにより、ブラウザをリロードしたりページを閉じたりしても、データが保持され、再度アクセスした際にデータが復元されるようになります。ユーザーがデータを入力した状態でページを閉じたり、リロードしたりしても、以前のデータが保持されるため、使いやすいアプリケーションとなっています。

- templateを使用した動的な行の生成    
addRow 関数では、templateを使用して新しい行の要素を動的に生成しています。TrainingRecord.rowHtmlメソッドで定義されたtemplateを元に、新しい行要素の作成により、コードを再利用できるようにし、行の追加や更新時簡単に要素を作成できるようになっています。

- 入力フォームにおけるイベントリスナーの活用     
各入力フォームには、変更があった場合にデータを更新するためのイベントリスナーが設定されています。changeイベントを監視し、その値をデータに反映し、変更時にはsaveEntries メソッドを呼び出してデータの保存を行います。よってユーザーの操作に応じてデータが適切に更新されます。

- 配列の要素の削除にfilterメソッドを活用    
deleteEntryメソッドでは、.filterメソッド使用し、与えられた dataToDelete と等しくない要素のみを抽出し、新しい配列として再構築しています。つまり、削除対象のデータ以外はそのまま保持されるため、特定の要素を削除しながらも、他のデータを保持し続けることができます。
